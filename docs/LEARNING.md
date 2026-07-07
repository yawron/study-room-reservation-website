# V1.0 学习笔记

---

## 1.1 安装 Docker Desktop，验证 `docker --version`（完成于 2026-07-07）

**做了什么**
安装 Docker Desktop 并验证 Docker 环境可用。

**涉及的技术点**

- **Docker Desktop**：macOS 上的 Docker 桌面版，自带 Docker Engine、Docker Compose、Docker CLI，内部跑一个轻量 Linux 虚拟机承载所有容器
- **Docker**：轻量级虚拟化工具，只虚拟应用运行所需的最小环境（容器），共享宿主机内核，启动快、体积小。对比传统虚拟机：虚拟机 = 租整栋楼，容器 = 只租一个房间
- **Docker Daemon（dockerd）**：后台服务进程，负责管理镜像、创建容器、分配网络、挂载存储。`docker` 命令是遥控器，daemon 是真正干活的管家
- **Docker Compose**：批量管理多个容器的编排工具，把容器配置写在 YAML 文件里，一条命令全部启动/停止

**关键决策**

- 选择 Docker 装 PostgreSQL 而非 `brew install`：环境隔离、不污染 macOS、可复现（团队统一用 `docker compose up`）、用完即删干净
- 本质是"借 Docker 承载 PostgreSQL"，省去原生安装和配置的麻烦

**踩的坑 / 注意事项**

- 无

---

## 1.2 编写 `docker-compose.yml`（PostgreSQL 17 容器，端口 5432）（完成于 2026-07-07）

**做了什么**
编写 docker-compose.yml，定义 PostgreSQL 17 容器配置。

**涉及的技术点**

- `image: postgres:17-alpine`：使用 Alpine Linux 版本的 PG 镜像（体积更小，约 250MB vs 标准版 450MB+）
- `ports: "5432:5432"`：宿主机 5432 端口映射到容器 5432，本地代码通过 `localhost:5432` 连接
- `volumes: pgdata:/var/lib/postgresql/data`：命名卷持久化数据，容器删了数据不丢
- `restart: unless-stopped`：Docker Desktop 启动时自动启动容器，手动 stop 后不自动重启
- 环境变量 `POSTGRES_USER/PASSWORD/DB`：容器首次启动时自动创建用户和数据库

**关键决策**

- 选 `17-alpine` 而不是 `17`（标准版）：开发阶段更看重镜像体积和启动速度，Alpine 足够用
- 用户名/密码直接写配置文件（`starstudy`/`starstudy_dev`）：开发环境没问题，生产环境必须用 `.env` 注入

**踩的坑 / 注意事项**

- 无

---

## 1.3 `docker compose up -d` 启动 PG，验证 `docker compose ps`（完成于 2026-07-07）

**做了什么**
执行 `docker compose up -d` 拉取 PostgreSQL 镜像并启动容器，用 `docker compose ps` 验证运行状态。

**涉及的技术点**

- `docker compose up -d`：`-d` = detached 模式（后台运行），不以 `-d` 启动则当前终端会被容器日志占住
- `docker compose ps`：查看当前项目所有容器的状态、端口映射（`0.0.0.0:5432->5432/tcp` 表示宿主机 5432 已绑定容器 5432）
- 镜像拉取流程：compose 发现本地没有 `postgres:17-alpine` → 自动从 Docker Hub 下载镜像层（layer）→ 解压 → 创建网络 → 创建卷 → 启动容器
- Docker 镜像分层机制：下载输出每一行对应镜像的一层，分层设计的优势在于不同镜像可以共享相同的底层（比如都基于 Alpine），节省磁盘空间和下载时间

**关键决策**

- 直接 `up -d` 而非手动 `docker pull` + `docker run`：compose 一条命令搞定镜像拉取、网络创建、卷挂载、容器启动，避免手动步骤遗漏
- 使用 Compose 编排而不是单条 `docker run`：后续加 Redis 等服务，只需在 yml 里加一个 service 再 `up -d`，无需改启动脚本

**踩的坑 / 注意事项**

- Docker Desktop 关闭后 daemon 不运行，`docker compose up -d` 会报 "Cannot connect to the Docker daemon"。需要用 `open -a Docker` 启动 Docker Desktop，等 daemon 就绪后才能执行容器操作

---

## 1.4 安装 Prisma 依赖：`npm install prisma @prisma/client`（完成于 2026-07-07）

**做了什么**
安装 Prisma 工具链：`prisma` CLI 和 `@prisma/client` 运行时，版本 7.8.0。

**涉及的技术点**

- **`prisma`（Prisma CLI）**：开发工具，用来生成 Prisma Client、执行数据库迁移（`prisma migrate dev`）、查看数据（`prisma studio`）、执行 Seed（`prisma db seed`）。只有开发时需要，但直接按 todo 要求装了运行时依赖
- **`@prisma/client`**：运行时库，应用代码中用来查询数据库的 ORM（`prisma.user.findMany()` 等）。它类型安全——根据 schema 自动生成类型，编译期就能发现字段名写错的问题
- Prisma 本质是一个 Node.js ORM，替代裸写 SQL，但比 TypeORM/Knex 强在它的 Schema-first 方式：写 Prisma Schema → 自动生成迁移 SQL + 类型安全的 Client

**关键决策**

- 选 Prisma 而不是 TypeORM 或 Knex：Prisma 的类型安全是编译期（自动从 schema 生成 TS 类型），TypeORM 是运行时装饰器，字段写错得跑起来才知道。对个人项目来说，Prisma 学习曲线最平，schema 文件本身就是文档
- 两者都装为 `dependencies` 而非 `devDependencies`：按 todo 描述执行，`prisma` CLI 理论上应该放 devDeps，后续可以调整

**踩的坑 / 注意事项**

- 无

---

## 1.5 初始化 Prisma：`npx prisma init`，生成 `prisma/schema.prisma`（完成于 2026-07-07）

**做了什么**
运行 `npx prisma init` 初始化 Prisma 项目结构，生成 `prisma/schema.prisma` 和 `prisma.config.ts`。

**涉及的技术点**

- **`npx prisma init`**：创建 Prisma 项目骨架——schema 文件（数据模型定义）、config 文件（Prisma 7 新增，替代旧版 schema 文件中 `datasource` 的 `url` 配置）
- **Prisma 7 vs 旧版本的变化**：旧版 `schema.prisma` 中 `datasource db` 块直接写 `url = env("DATABASE_URL")`，Prisma 7 改到 `prisma.config.ts` 中统一管理 `datasource.url`，schema 文件更纯粹只关注数据模型
- **Generator**：`provider = "prisma-client"` 指定生成 Prisma Client，`output = "../generated/prisma"` 指定输出目录
- 目录结构：schema + 后续迁移文件都在 `prisma/` 下

**关键决策**

- 接受 Prisma 7 的新配置结构（`prisma.config.ts`）而不是降级：新项目按最新标准做，避免后续升级麻烦
- DATABASE_URL 在 `.env` 中提前配好了（`postgresql://starstudy:starstudy_dev@localhost:5432/starstudy`），和 docker-compose.yml 中的用户名/密码/库名对应

**踩的坑 / 注意事项**

- `npx prisma init` 检测到 `.env` 已有 DATABASE_URL 会跳过写入只给 warn，不会覆盖已有配置

---

## 1.6 配置 `.env` 中的 `DATABASE_URL`（完成于 2026-07-07）

**做了什么**
确认 `.env` 中 DATABASE_URL 与 docker-compose.yml 的 PostgreSQL 配置一致。

**涉及的技术点**

- **DATABASE_URL 格式**：`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`，这是一个标准的数据库连接字符串（JDBC URL 风格），PostgreSQL/MySQL 等关系型数据库通用这个格式
- **`?schema=public`**：指定默认 schema 为 `public`（PostgreSQL 的默认 schema），一个 PostgreSQL 数据库可以有多个 schema，每个 schema 下有各自的表集合
- Prisma 通过 `prisma.config.ts` 中 `datasource.url: process.env["DATABASE_URL"]` 读取此变量

**关键决策**

- 连接字符串中用户名/密码和 docker-compose.yml 保持一致：`starstudy`/`starstudy_dev`——开发环境简单至上，不引入额外的环境变量管理工具
- 用 `localhost:5432` 而非 Docker 内部网络：容器端口已映射到宿主机，开发时应用直接用 localhost 连即可，不需要进入 Docker 网络

**踩的坑 / 注意事项**

- 无（1.5 npx init 之前就手动配好了，所以 init 时自动检测跳过）

---

## 2.1 编写 Prisma Schema（User, Room, Booking, Review 四张表）（完成于 2026-07-07）

**做了什么**
在 `prisma/schema.prisma` 中定义四张核心表（User/Room/Booking/Review）、三个枚举类型（UserRole/RoomType/BookingStatus）、以及表之间的外键关系。

**分析**

- 两个实体：用户 房间
- 两个关系：预定 评价

**涉及的技术点**

- **Prisma Schema 语法**：`model` 定义数据表，`enum` 定义枚举，`@id` 主键，`@default(cuid())` 自动生成 ID，`@unique` 唯一约束，`@updatedAt` 自动更新时间戳，`@db.Date` 指定 PostgreSQL 原生 DATE 类型
- **外键关系**：`@relation(fields: [roomId], references: [id])` 定义一对多关系——Room 和 User 各持有 bookings[] 和 reviews[] 反向字段
- **PostgreSQL 原生类型映射**：`amenities String[]` → PG 的 `TEXT[]` 数组列；`date DateTime @db.Date` → PG 的 `DATE` 类型（只存日期不含时间）
- **枚举对比**：TS 的 RoomType enum 值是中文（`'静音专注仓'`），Prisma enum 值是英文（`QUIET_POD`），数据层和展示层分离——数据库存英文，前端用中文映射展示

**关键决策**

- ID 用 `cuid()` 而不是 `uuid()` 或自增 `Int`：cuid 是分布式友好的短 ID（约 25 字符），URL 中比 UUID（36 字符）更短，比自增 Int 更安全（不暴露数据量）。但 Prisma 文档推荐 `cuid()` 或 `uuid()`，选 cuid 主要因为 ID 更短看起来更干净
- `date` 用 `@db.Date` 而非 `String`：数据层的职责是正确表示数据，PG 原生 DATE 类型有范围校验、日期运算能力，适配层（API 序列化时转成 ISO String）应该在应用层解决
- `startTime`/`endTime` 用 `String` 而非 `@db.Time`：PG 的 TIME 类型在 JS 侧反序列化为 Date 对象，处理不便。用 String 存 "HH:mm" 格式更直接，且 booking 的时间比较逻辑简单

**踩的坑 / 注意事项**

- Prisma 7 的 `prisma.config.ts` 是新结构，`schema.prisma` 中 `datasource db` 块不再写 `url = env("DATABASE_URL")`，而是在 config.ts 中通过 `datasource.url` 读取。如果回退到 Prisma 6 风格会报 "url is required" 错误
- `npx prisma format` 会自动调整换行和缩进，和 Prettier 类似，建议写完 schema 跑一次 format 保持风格一致

---

## 4.1 安装 bcryptjs（完成于 2026-07-07）

**需求背景**
密码不能明文存储——DB 泄露则所有账号暴露。bcrypt 是密码哈希的行业标准。

**做了什么**
`npm install bcryptjs @types/bcryptjs`，选纯 JS 实现避免原生编译。

**技术点**
- `bcryptjs`：纯 JS bcrypt，跨平台无需 node-gyp
- `bcrypt.hash(pwd, rounds)` 生成哈希 / `bcrypt.compare(pwd, hash)` 验证

**关键决策**
- 选 `bcryptjs` 而非 `bcrypt`：后者依赖原生 C++ 模块，跨平台编译成本高

**踩坑**
- 无

---

## 4.2~4.7 注册接口（完成于 2026-07-07）

**需求背景**
前端全栈后第一个真正的数据写入 API——用户注册必须完成"校验 → 查重 → 哈希 → 入库 → 签发 Token"完整链路，任何一步缺失都会导致安全漏洞或数据不一致。

**做了什么**
重写 `POST /api/auth/register`：withValidation(registerSchema) → 查重 → bcrypt.hash → prisma.user.create → 签发双 Token → Set-Cookie。

**技术点**
- `bcrypt.hash(pwd, 10)`：10 轮 salt 是开发环境平衡值（生产通常 12），每次哈希结果不同（内置随机 salt）
- `prisma.user.findUnique({ where: { email } })`：利用 email 唯一索引快速查重
- `select: { id, name, email, role, createdAt }`：不返回 passwordHash

**关键决策**
- 不返回 passwordHash：前端不需要也绝不能拿到密码哈希
- 4.3~4.7 作为 4.2 的子任务全部实现：每个步骤都依赖前一步的输出，拆成多次编辑不现实

**踩坑**
- 无
