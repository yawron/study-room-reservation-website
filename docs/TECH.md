# TECH.md — 全栈化技术方案决策文档

## 项目目标

将当前"伪全栈"（Cookie/localStorage 存储）的 Next.js 项目改造为真正的全栈项目。

### 核心动机

| 维度 | 说明 |
|------|------|
| **简历竞争力** | 前端项目遍地都是，全栈项目 = 差异化。面试官会关注你是否碰过数据库、认证、部署 |
| **技术完整性** | 掌握前后端全链路，理解数据从浏览器到数据库的完整流转 |
| **现有基础** | 前端 + JWT 认证骨架已经就位，改造性价比高 |

### 约束条件

- 后端经验较少，需要低学习曲线
- 偏好 TypeScript（前后端同一语言）
- 已有 Next.js + React 基础

### 选型原则

1. 是否贴合项目本身的需求？是否过度设计？
2. 是否贴合当前主流企业的使用？

---

## 当前状态诊断

| 模块 | 当前实现 | 问题 |
|------|---------|------|
| 认证 | JWT 双令牌 (Access + Refresh)，`jose` 签发 | 登录不需要密码，任何邮箱都能获取 Token |
| 用户存储 | `localStorage`（服务端代码中 check `typeof window`） | 非持久化，无法跨设备，服务端不可用 |
| 房间数据 | `mockData.ts` 硬编码数组 | 无分页、筛选、搜索 |
| 预订数据 | 存 Cookie (`starstudy_bookings_server`) | 4KB 限制，每次 HTTP 请求携带，清缓存即丢失 |
| 评价数据 | 存 Cookie (`starstudy_reviews_server`) | 同上 |
| 预订逻辑 | Server Action 直接写入 Cookie | 无时间冲突检测，无事务保证 |
| 测试 | 无 | 全栈项目没有测试 = 简历减分项 |
| 部署 | 仅 `npm run dev` | 无生产环境、无容器化 |

---

## 已决策的技术方案

### 决策 1 — 架构模式

**选定：** Next.js 单体全栈（方案 A）

- 首先完成单体全栈版本，跑通全链路（数据库 → API → 前端 → 部署）
- 后续迭代中可评估升级为 Turborepo Monorepo（方案 B）
- NestJS 独立后端（方案 C）不适合当前阶段——过度设计，学习曲线过高

### 决策 2 — 数据库

**选定：** PostgreSQL + Docker 本地运行，后续可迁至 Neon Serverless

- 关系型数据库贴合本项目的强关联数据模型
- PostgreSQL 是当前 Node.js/TS 生态的主流选择，企业认可度最高
- 本地 Docker 方式免去服务注册配置，10 分钟内可启动

### 决策 3 — ORM

**选定：** Prisma

- TypeScript 生态中最主流的 ORM，学习曲线最低
- Schema-first 方式：定义即文档、定义即类型、定义即迁移

### 决策 4 — 认证方案

**选定：** 保留现有 JWT 双令牌实现 + 添加 bcrypt 密码哈希

- 现有 JWT 代码已完成约 70%（签发/验证/刷新/Cookie/middleware/拦截器）
- 自建认证比引入第三方库在简历上含金量更高（面试官可以深入提问原理）
- 改动范围：注册加密码哈希、登录从数据库验证用户

### 决策 5 — 测试策略

**选定：** Vitest + React Testing Library

- 有测试 vs 没测试 = 简历质的区别
- 最低要求：核心 API 集成测试 + 至少一个关键组件测试

### 决策 6 — 容器化与部署

**选定：** Docker Compose（本地开发） + Vercel/Neon（线上演示）

- Docker Compose：一条命令启动全栈环境（Next.js + PG），简历硬通货
- Vercel/Neon：生成线上 demo 链接，面试时直接展示

### 决策 7 — 数据模型

**选定：** 按优先级分批次扩展

- 🔴 必须（V1）：`User.passwordHash`、所有实体的 `createdAt`/`updatedAt`
- 🟡 推荐（V1）：预订冲突检测、`User.role` (USER/ADMIN)、API 分页/筛选
- 🟢 可选（V2+）：管理员后台、预订审批流程、签到签退、消息通知
- 具体字段设计在深入实施时细化

### 决策 8 — API 文档

**选定：** 手写 Markdown（`docs/API.md`）

- 全栈项目的 API 文档是完整性的体现
- Markdown 表格足够清晰：端点、方法、参数、返回值
- 暂不需要 Swagger 那样的重量级方案

---

## 最终技术栈

```
┌──────────────────────────────────────────┐
│         全栈技术栈（全 TypeScript）        │
├──────────────────────────────────────────┤
│                                          │
│  前端框架     Next.js 14 App Router       │
│  样式         Tailwind CSS                │
│  状态管理     React Context               │
│  类型         TypeScript                  │
│                                          │
│  ──────── API 层 ────────                 │
│                                          │
│  API 路由     Next.js API Routes          │
│  Server Actions  表单提交                  │
│  认证         JWT 双令牌 (jose) + bcrypt  │
│  校验         Zod                         │
│                                          │
│  ──────── 数据层 ────────                 │
│                                          │
│  ORM          Prisma                      │
│  数据库       PostgreSQL (本地 Docker)     │
│  迁移         Prisma Migrate              │
│                                          │
│  ──────── 基础设施 ────────               │
│                                          │
│  测试         Vitest + RTL               │
│  容器化       Docker Compose              │
│  代码规范     ESLint + Husky + Commitlint │
│  线上部署     Vercel + Neon               │
│                                          │
└──────────────────────────────────────────┘
```

### 简历话术汇总

| 领域 | 话术 |
|------|------|
| 全栈架构 | "基于 Next.js 全栈框架，自建 RESTful API 层和 Prisma ORM 数据层，实现 JWT 双令牌认证和 PostgreSQL 数据持久化" |
| 认证 | "基于 jose 实现 JWT 双令牌认证，Access Token 存内存、Refresh Token 用 HttpOnly Cookie 存储；通过 bcrypt 密码哈希 + SameSite Cookie 防护保障安全" |
| 数据库 | "PostgreSQL + Prisma ORM，Schema 驱动类型生成与数据库迁移，确保前后端类型安全" |
| 请求层 | "封装 Axios 拦截器实现 401 自动 Token 刷新 + 并发请求排队机制" |
| 测试 | "使用 Vitest + React Testing Library，覆盖核心预订流程 API 集成测试和关键 UI 组件单元测试" |
| 容器化 | "Docker Compose 管理 Next.js + PostgreSQL 运行环境，一键启动全栈开发环境" |

---

## 迭代计划

### V1.0 — 数据基础 + 认证打通

**目标：** 消灭所有 mock 数据，让用户能真正注册、登录、浏览房间

```
交付物：
  ├── docker-compose.yml（PostgreSQL 容器）
  ├── Prisma Schema（User, Room, Booking, Review）
  ├── Prisma Client 单例（lib/prisma.ts）
  ├── Seed 脚本（将 mockData 房间数据写入 DB）
  ├── 全局错误处理中间件 + 统一响应格式 { code, data, message }
  ├── 请求参数 Zod 校验（注册/登录接口）
  ├── 注册 API：POST /api/auth/register（name + email + password → bcrypt → DB）
  ├── 登录 API：POST /api/auth/login（email + password → 查 DB 验证 → 签发 JWT）
  ├── 删除 src/services/mockData.ts 中的 mock 用户逻辑 + localStorage 代码
  └── 房间列表 API 改为从 DB 读取

验收标准：
  ✅ 新用户可以通过 /register 注册，密码被 bcrypt 哈希存储
  ✅ 请求参数经 Zod 校验，非法输入返回统一错误格式
  ✅ 已注册用户可以通过 /login 登录，获取 JWT Token
  ✅ 所有 API 返回统一格式 { code, data, message }
  ✅ 登录后可以正常浏览自习室列表（数据来自 PostgreSQL）
  ✅ 现有 JWT 刷新、middleware 路由守卫、401 拦截器全部正常工作
  ✅ npm run dev 可以连上 Docker PG 正常运行
```

### V1.1 — 预订 + 评价数据持久化

**目标：** 把预订和评价从 Cookie 迁移到数据库，加上冲突检测

```
交付物：
  ├── 预订 Server Action 改为写入 DB（替换 Cookie 方案）
  ├── 预订冲突检测（同一房间 + 同一日期 + 时间段重叠 → 拒绝）
  ├── 取消预订改为更新 DB status 字段
  ├── 评价 Server Action 改为写入 DB（替换 Cookie 方案）
  ├── 房间详情页从 DB 加载评论
  ├── 分页/筛选参数支持（房间列表 API）
  └── 删除 Cookie 存储预订/评价的旧代码

验收标准：
  ✅ 用户预订后刷新页面，预订记录不丢失（DB 持久化）
  ✅ 同一房间同一时段不能重复预订
  ✅ 评价提交后刷新页面，评价仍存在
  ✅ 房间列表支持基本的类型筛选和分页
```

### V1.2 — 测试 + API 文档

**目标：** 为项目加上测试和文档，提升简历完整度

```
交付物：
  ├── docs/API.md（所有端点文档）
  ├── API 集成测试：注册 → 登录 → 浏览房间 → 预订 → 取消预订 完整流程
  ├── 登录失败、冲突预订、未认证访问的边界测试
  ├── 至少 1 个关键组件的单元测试（如 BookingModal）
  └── README 更新（技术栈、启动步骤）

验收标准：
  ✅ npm test 全部通过
  ✅ API 文档与代码实际行为一致
  ✅ 新开发者能够根据 README 在本地启动项目
```

### V1.3 — Docker 容器化 + 线上部署

**目标：** 让项目可以一键启动、线上可访问

```
交付物：
  ├── Dockerfile（Next.js 应用镜像，多阶段构建）
  ├── docker-compose.yml（Next.js + PostgreSQL 编排，Volume 数据持久化）
  ├── 环境变量模板 .env.example
  ├── Vercel + Neon 线上部署
  └── 一个可以分享的线上 demo URL

验收标准：
  ✅ docker compose up 在任意机器上可一键启动全栈环境
  ✅ 数据库数据通过 Volume 挂载，重启容器不丢失
  ✅ 线上 demo 可以正常注册/登录/预订
  ✅ .env.example 文档清晰
```

### V2.0（规划中）— 工程化升级 + 管理后台

```
候选功能：
  ├── Turborepo Monorepo 重构（apps/web + packages/shared）
  ├── 管理员角色 + 后台页面（房间 CRUD、预订管理）
  ├── 预订审批流程（默认 pending，管理员确认后变 confirmed）
  └── 签到/签退机制
```

---

## 待定事项

数据模型的具体字段设计（如 `User.role` 枚举值、`Booking` 的时间字段格式等）将在进入 V1.0 开发时，结合现有 TypeScript 类型定义具体细化。
