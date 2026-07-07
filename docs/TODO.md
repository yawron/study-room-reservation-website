# TODO 列表

---

## V1.0 — 数据基础 + 认证打通

关联：[V1.0-IMPLEMENTATION.md](./V1.0-IMPLEMENTATION.md) | 技术决策：[TECH.md](./TECH.md)

### 阶段 1：环境搭建

> **需求背景**：项目当前所有数据来自前端 mock（`mockData.ts`），没有持久化存储。V1.0 目标是"消灭 mock 数据"，首先要搭建真实的后端数据基础设施。PostgreSQL 是本项目唯一的持久化数据源，Docker 提供零侵入的数据库运行环境，Prisma 作为 ORM 桥接 Node.js 与 PG。
>
> **主要任务**：部署 PostgreSQL 容器 → 安装 Prisma 工具链 → 初始化项目配置，打通"代码 → Prisma → PostgreSQL"这一整条数据链路。

- [x] 1.1 安装 Docker Desktop，验证 `docker --version`
- [x] 1.2 编写 `docker-compose.yml`（PostgreSQL 17 容器，端口 5432）
- [x] 1.3 `docker compose up -d` 启动 PG，验证 `docker compose ps`
- [x] 1.4 安装 Prisma 依赖：`npm install prisma @prisma/client`
- [x] 1.5 初始化 Prisma：`npx prisma init`，生成 `prisma/schema.prisma`
- [x] 1.6 配置 `.env` 中的 `DATABASE_URL`

### 阶段 2：数据模型

> **需求背景**：数据库只是"空壳"，没有表结构就无法存储任何业务数据。Prisma Schema 是整个应用的数据蓝图——定义哪些实体、哪些字段、实体之间怎么关联。Schema 决定了后续所有 API 能读写什么数据、以什么形式返回。这步不做好，后面改 schema 成本极高。
>
> **主要任务**：根据现有 TS 类型倒推数据库表设计 → 编写 Prisma Schema → 执行迁移 → 生成 Client 单例 → 用 seed 数据验证表设计合理。

- [x] 2.1 编写 Prisma Schema（User, Room, Booking, Review 四张表）
  - [x] 2.1.1 User 表：id, name, email, passwordHash, role(USER/ADMIN), createdAt, updatedAt
  - [x] 2.1.2 Room 表：id, name, type, capacity, pricePerHour, imageUrl, description, amenities, isAvailable, createdAt, updatedAt
  - [x] 2.1.3 Booking 表：id, roomId(FK), userId(FK), date, startTime, endTime, status, totalPrice, createdAt, updatedAt
  - [x] 2.1.4 Review 表：id, roomId(FK), userId(FK), rating, comment, createdAt
- [x] 2.2 `npx prisma migrate dev --name init` 执行迁移
- [x] 2.3 `npx prisma studio` 验证表结构
- [x] 2.4 编写 `src/lib/prisma.ts`（Prisma Client 单例）
- [x] 2.5 编写 Seed 脚本：将 `mockData.ts` 中 14 个房间写入 DB
- [x] 2.6 `npx prisma db seed` 执行，验证数据

### 阶段 3：统一响应 + 错误处理 + Zod 校验

> **需求背景**：前端转全栈 → 多了后端 API → ① 每个 API 都要返回 HTTP 响应 → 响应格式不统一则前端要写 N 套解析逻辑 → 统一 `{ code, data, message }`；② 用户传什么数据不可控（空字符串、非法邮箱、太短的密码）→ 手写 if 校验又臭又长 → 用 Zod 声明式校验，一行 Schema 顶十行 if。
>
> **3.1~3.5 协同工作流**：
>
> ```
> 请求进来
>   → withValidation(registerSchema, handler)
>     → schema.parse(req.json())  // 校验
>       → 通过：handler(req, cleanBody)  // 干净的、带类型的 body
>       → 失败：自动抛错，withErrorHandler 接住 → 400 响应
> Handler 收到的 body 是已经校验过的，可以直接信任它的类型和内容。
> ```
>
> **主要任务**：定义全项目统一的响应格式 → 错误处理包装函数（消除 try/catch 样板代码）→ Zod 校验体系（输入有保障、代码不冗余）。

- [x] 3.1 定义统一响应格式 `{ code: number, data: T | null, message: string }`
  > **需求分析**：前端依赖 API 返回格式做统一解析——如果每个接口返回结构不同，前端需要为每个接口写独立的错误处理和数据提取逻辑。定义统一的响应契约（状态码 + 数据 + 消息）是全部 API 的通信基础。
- [x] 3.2 编写 API 错误处理包装函数（try/catch → 统一错误响应）
  > **需求分析**：每个 Route Handler 都可能抛异常（数据库超时、字段冲突、未知错误），手动在每个接口写 try/catch 会重复且容易遗漏异常类型。需要一个全局错误边界统一捕获所有未处理异常并转换为标准错误响应。
- [x] 3.3 安装 Zod：`npm install zod`
  > **需求分析**：API 的输入来自不可信的外部请求——字段缺失、类型错误、格式非法都是常态。没有校验层会导致脏数据写入数据库或程序运行时崩溃。声明式 Schema 校验是后端接口的标准输入防护手段。
- [x] 3.4 编写注册/登录接口的 Zod Schema（email 格式、password 最小长度等）
  > **需求分析**：认证接口是系统安全的第一道防线——邮箱格式不合法会浪费数据库查询，密码过短会导致暴力破解。注册和登录的校验规则不同（密码长度要求、是否必填姓名），需要两套独立的校验契约。
- [x] 3.5 编写 Zod 校验中间件函数（同时给 withErrorHandler 加了 ZodError 捕获）
  > **需求分析**：校验逻辑不应侵入业务 Handler——解析请求体、校验字段、转换类型这些横切关注点应当与业务逻辑解耦。中间件模式让校验失败自动返回错误响应，校验通过后 Handler 收到的数据是已被类型保证的干净输入。

### 阶段 4：注册接口

> **需求背景**：认证是"消灭 mock 数据"的第一步——当前登录是假的（写死一个 mock 用户），用户无法真正注册账号。注册是整个认证体系的入口，必须先把用户写入数据库，后续登录和路由守卫才有意义。密码安全（bcrypt 哈希）是底线要求。
>
> **主要任务**：安装 bcrypt → 实现 POST /api/auth/register → Zod 校验 → 邮箱唯一性检查 → 密码哈希 → 写入数据库。

- [x] 4.1 安装 bcrypt：`npm install bcryptjs @types/bcryptjs`（用 bcryptjs 避免原生编译）
  > **需求分析**：用户密码不能明文存储——数据库泄露则所有账号直接暴露。密码哈希是认证系统的安全底线，bcrypt 内置盐值和计算成本因子，是业界标准的密码哈希算法。选纯 JS 实现的 bcryptjs 而非原生 bcrypt，避免跨平台编译问题。
- [x] 4.2 新建 `POST /api/auth/register` Route Handler（含 4.3~4.7 完整链路）
  > **需求分析**：当前注册接口不入库——用户提交后凭空生成 ID 返回，刷新即丢失。需要将注册从 mock 流程改造为真实的"校验 → 查重 → 哈希 → 入库"链路，这是用户数据写入数据库的第一个入口。
  - [x] 4.3 Zod 校验请求体（name 必填, email 格式, password ≥ 6 位）→ 通过 withValidation + registerSchema 实现
  - [x] 4.4 检查邮箱是否已注册 → 已存在返回 409 → prisma.user.findUnique
  - [x] 4.5 bcrypt.hash(password, 10) 生成哈希 → bcryptjs 10 轮盐
  - [x] 4.6 Prisma 写入 User 表 → prisma.user.create
  - [x] 4.7 返回统一格式 `{ code: 200, data: { user }, message: '注册成功' }` → success() 工厂

### 阶段 5：登录接口改造

> **需求背景**：注册写完用户能入库，但登录还是走 mock 逻辑（不查数据库、不验证密码）。需要把登录从"前端假登录"改造为"查 DB + 验密码 + 签发 JWT 双 Token"的完整认证流程。登录改造完成后，`/api/auth/me` 返回的才是真实用户信息，而不总是 mock 数据。
>
> **主要任务**：改造 login API → 查数据库验证密码 → 签发 Access Token + Refresh Token → Set-Cookie RT → 验证 me 接口返回真实用户。

- [x] 5.1 改造 `POST /api/auth/login` Route Handler（含 5.2~5.7 完整链路）
  > **需求分析**：当前登录不查数据库不验密码——只要给个邮箱就能登。需要将登录从 mock 假登录改造为"查 DB → 验密码 → 签发 Token"的完整认证流程。同时 /api/auth/me 也从 mock 改为 Prisma 查询，登录后获取的是真实用户信息。
  - [x] 5.2 Zod 校验请求体 → withValidation + loginSchema
  - [x] 5.3 Prisma 查 DB 获取用户（by email）→ prisma.user.findUnique
  - [x] 5.4 bcrypt.compare 验证密码 → 不匹配返回 401（不区分"用户不存在"和"密码错误"防止撞库）
  - [x] 5.5 签发 JWT Access Token + Refresh Token（保留现有 lib/jwt.ts）
  - [x] 5.6 返回 Token，Set-Cookie Refresh Token
  - [x] 5.7 /api/auth/me 从 mock 改为 Prisma 查询，返回真实用户信息

### 阶段 6：房间 API 改造

> **需求背景**：认证打通后用户能注册登录，但浏览房间时数据仍来自 mock 而非真实数据库。需要把房间列表从 mock 切换为 Prisma 查询，并加上分页和筛选——这是"消灭 mock 数据"的最后一环核心业务 API。
>
> **主要任务**：改造 GET /api/rooms → Prisma 查询替代 mockData → 支持 type 筛选 + 分页 → 返回数据含分页信息。

- [ ] 6.1 改造 `GET /api/rooms`，从 Prisma 查询替代 `mockData`
- [ ] 6.2 支持 query 参数：`?type=QUIET_POD&page=1&limit=10`
- [ ] 6.3 返回数据 + 分页信息

### 阶段 7：清理

> **需求背景**：前 6 个阶段完成后，所有 mock 逻辑已被真实实现取代。但 `mockData.ts` 中仍残留 localStorage 操作、mock 用户导出、登录接口中的 mock 分支代码。这些死代码不仅增加文件体积，更严重的是新人读代码时可能误以为 mock 路径仍在使用。清理是"消灭 mock 数据"的收尾——删干净、验证全链路。
>
> **主要任务**：删除 mockData.ts 中的用户 mock 逻辑 → 删除 login 路由中的 mock 分支 → 端到端验证注册→登录→浏览房间→路由守卫全链路正常。

- [ ] 7.1 删除 `mockData.ts` 中用户相关的 `localStorage` 代码
- [ ] 7.2 删除 `mockData.ts` 中 `MOCK_USER` / `INITIAL_USER` 导出
- [ ] 7.3 删除 `api/auth/login/route.ts` 中动态创建 mock 用户的逻辑
- [ ] 7.4 验证：注册新用户 → 登录 → 浏览房间 → middleware 路由守卫正常
