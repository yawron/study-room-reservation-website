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

## 2.1 编写 Prisma Schema（含 2.1.1~2.1.4 四表字段验证）（完成于 2026-07-07）

**做了什么**
在 `prisma/schema.prisma` 中定义四张核心表（User/Room/Booking/Review）、三个枚举类型（UserRole/RoomType/BookingStatus）、以及表之间的外键关系。

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

**各表补充要点**
- **User（2.1.1）**：`@unique` 在 email 上会建唯一索引，DB 层保证邮箱不重复，比应用层更可靠；`UserRole` 默认 `USER`，最小权限原则
- **Room（2.1.2）**：`amenities String[]` → PG `TEXT[]` 数组，支持 `array_contains` 查询
- **Booking（2.1.3）**：`date @db.Date` 只存日期（4 字节 vs TIMESTAMP 8 字节）；`status` 用枚举而非 String，DB 层约束防非法值
- **Review（2.1.4）**：无 `updatedAt`——评价通常不可修改；外键默认 `ON DELETE RESTRICT` 防误删

---

## 2.2 `npx prisma migrate dev --name init` 执行迁移（完成于 2026-07-07）

**做了什么**
运行 `prisma migrate dev` 将 schema 同步到 PostgreSQL，生成并执行迁移 SQL。

**涉及的技术点**
- **`prisma migrate dev`**：三步合一——① 比较 schema 与当前 DB 状态的差异 ② 生成迁移 SQL 文件到 `prisma/migrations/` ③ 执行 SQL 并记录到 `_prisma_migrations` 表
- **`_prisma_migrations`**：Prisma 自动创建的表，记录所有迁移的历史（文件名、checksum、执行时间）。这就是数据库版本的"git log"，团队协作时通过此表判断谁的迁移还没跑
- **迁移文件**：`migration.sql` 是 Prisma 自动生成的原始 SQL（CREATE TABLE、ALTER TABLE 等），可手动 review 后再提交版本控制
- `--name init`：给迁移命名，会体现在文件名前缀 `20260707055317_init`（时间戳+名称），方便后续 `prisma migrate status` 查看

**关键决策**
- 首次迁移命名为 `init`：这是所有后续迁移的基线，命名简洁清晰
- 迁移 SQL 文件提交到 Git：团队成员可以 `prisma migrate dev` 重放相同迁移，保证数据库 schema 一致

**踩的坑 / 注意事项**
- 迁移需要 PostgreSQL 容器在运行且 DATABASE_URL 正确，否则 `prisma migrate dev` 会连接失败
- 如果 schema 有语法错误，`prisma validate` 能通过但 migrate 不会执行（先 validate 再 migrate 是好习惯）

---

## 2.3 `npx prisma studio` 验证表结构（完成于 2026-07-07）

**做了什么**
用 Prisma Studio（localhost:5555）和 `psql \d` 双重验证四张表的结构与 schema 一致。

**涉及的技术点**
- **Prisma Studio**：Prisma 自带的数据库可视化工具，可以直接在浏览器中查看/编辑数据，替代 pgAdmin/DBeaver 等重量级工具
- **`\d "TableName"`**：psql 中查看表结构的命令，显示列/类型/默认值/约束/外键关系（PostgreSQL 区分大小写的表名需要双引号包裹）
- **ON UPDATE CASCADE / ON DELETE RESTRICT**：Prisma 默认的外键策略——更新父表 ID 时级联更新子表，但删除父表记录时若有子表引用则阻止删除

**关键决策**
- 用 `psql` 而非仅依赖 Prisma Studio 做验证：psql 输出可存为文本证据，Studio 是 GUI 不方便留存记录
- 验证方式 = Studio（人工浏览）+ psql（精确对比），互补

**踩的坑 / 注意事项**
- PostgreSQL 中 Prisma 创建的表名和枚举名带双引号（`"User"`, `"RoomType"`），直接 `\d User` 会报错，必须写成 `\d "User"`

---

## 2.4 编写 `src/lib/prisma.ts`（Prisma Client 单例）（完成于 2026-07-07）

**做了什么**
创建 Prisma Client 单例文件，配置 Prisma 7 的 PG 驱动适配器，防止 Next.js 热重载创建多个数据库连接池。

**涉及的技术点**
- **Prisma 7 驱动适配器模式**：Prisma 7 解耦了 ORM 和数据库驱动，Client 不再直接用 `DATABASE_URL`，需要显式传入 adapter（`new PrismaPg(...)`）。好处是可以在 Client 层面替换不同驱动（PG、PlanetScale、Neon 等）
- **`@prisma/adapter-pg`**：Prisma 官方的 PostgreSQL 驱动适配器，基于 `pg` npm 包（Node.js 原生 PG 驱动），构造函数接受连接字符串或 `pg.Pool` 实例
- **Next.js 单例模式（`globalThis` 技巧）**：开发模式下 Next.js 每次热重载重新执行模块，不加单例会导致每次重载新建一个连接池，最终连接数耗尽。`globalThis` 在 Node.js 中是跨模块热重载的全局对象，把实例挂上去避免重复创建

**关键决策**
- 用 `@prisma/adapter-pg` 而不是 `pg` 直连：Prisma 7 强制要求 adapter 模式，这是新版架构的设计决定，不兼容旧版 `new PrismaClient()` 无参调用
- 额外安装 `@prisma/adapter-pg`：todo 描述只写了 `prisma` 和 `@prisma/client`，但 Prisma 7 实际还需要 adapter。这是做 todo 过程中发现的范围外依赖

**踩的坑 / 注意事项**
- Prisma 7 `new PrismaClient()` 必须传 `{ adapter: ... }`，不传会报 `TS2554: Expected 1 arguments, but got 0`，这是 Prisma 7 相比 5/6 的最大 breaking change

---

## 2.5 编写 Seed 脚本（完成于 2026-07-07）

**做了什么**
将 `mockData.ts` 中 14 个房间写成 `prisma/seed.ts`，映射为 Prisma 英文枚举值后写入 PostgreSQL，并配置 `tsx` 运行环境。

**涉及的技术点**
- **`prisma.seed`**：`package.json` 中的字段，`npx prisma db seed` 自动读取并执行对应的命令。兼容旧 Prisma 版本的方式
- **`tsx`**：TypeScript 运行时，直接执行 `.ts` 文件无需先 tsc 编译，开发工具链常用它替代 `ts-node`（更快、兼容性更好）
- **枚举值映射**：mock 数据使用 TS 中文枚举（`RoomType.QUIET_POD = '静音专注仓'`），seed 脚本直接使用 Prisma 英文枚举值（`'QUIET_POD'`），因为数据库存的是英文 key
- **`dotenv/config`**：让 seed 脚本独立运行时也能读取 `.env`——seed 不是 Next.js 进程，不会自动加载环境变量
- `prisma.room.create({ data })`：逐条插入 14 条记录。对于 14 条数据的 seed 规模，`create` 循环比 `createMany` 更可读且性能差异可忽略

**关键决策**
- 用 `tsx` 而非 `ts-node`：tsx 是 ts-node 的现代替代品，启动更快，对 ESM/CJS 混合项目兼容性更好，且无需额外配置
- 用 `dotenv` 加载环境变量而非从 prisma.config.ts 读取：seed 脚本是独立进程，需要自己能拿到 `DATABASE_URL`
- 逐条 `create` 而非 `createMany`：14 条数据量极小，逐条插入可以看到每条的日志，方便 debug；`createMany` 在此量级无性能收益

**踩的坑 / 注意事项**
- 不能直接用 `tsc` 检查 seed 脚本类型——`@prisma/adapter-pg` 的类型定义与项目 tsconfig 不全兼容（`pg` 默认导出、private identifiers），但这不影响 tsx 运行时执行

---

## 2.6 `npx prisma db seed` 执行，验证数据（完成于 2026-07-07）

**做了什么**
通过 `npx prisma db seed` 正式执行 seed，验证数据写入，发现并修正 Prisma 7 的 seed 配置位置。

**涉及的技术点**
- **Prisma 7 seed 配置变更**：Prisma 7 的 seed 命令不再从 `package.json` 的 `prisma.seed` 读取，而是从 `prisma.config.ts` 的 `migrations.seed` 字段读取。这是 Prisma 7 集中管理配置的设计理念
- **`npx prisma db seed` 流程**：加载 config → 读取 `migrations.seed` → shell 执行命令 → 输出 "🌱 The seed command has been executed"

**关键决策**
- 移除 `package.json` 中的 `prisma.seed`，统一在 `prisma.config.ts` 管理：Prisma 7 已不再识别 package.json 的 seed 字段，保留只会让人困惑

**踩的坑 / 注意事项**
- `prisma db seed` 在 package.json 中配置 `prisma.seed` 在 Prisma 7 中不生效，报 "No seed command configured"，必须改用 `prisma.config.ts` 的 `migrations.seed` 字段
