# StarStudy - 高端校园自习室预订平台

StarStudy 是一个现代化的校园自习空间预订平台，致力于提供星巴克式的学习环境体验。项目采用 Next.js 全栈框架构建，集成了预订管理、实时状态模拟和用户评价系统。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38b2ac)

## ✨ 主要功能

- **🏠 空间浏览**：按类型（静音仓、协作室、景观位等）和容量筛选自习室。
- **📅 实时预订**：可视化的日期与时间选择，支持时长自定义。
- **🔐 用户认证**：基于 JWT (jose) 的安全登录与注册系统，包含 Access/Refresh Token 机制。
- **💬 评价系统**：用户可对使用过的空间进行评分和评论。
- **📱 响应式设计**：完美适配桌面端与移动端设备。
- **📊 个人中心**：查看历史预订记录及状态。

## 🛠 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **认证**: JWT (使用 `jose` 库)
- **HTTP请求**: Axios (封装拦截器)

## 📂 目录结构

项目遵循标准的 Next.js 目录结构，核心代码位于 `src` 目录下：

```bash
/
├── src/
│   ├── app/              # Next.js App Router 页面与 API 路由
│   ├── components/       # UI 组件 (基础组件 Primitives, 业务组件 Modal 等)
│   ├── context/          # 全局状态管理 (如 AuthContext)
│   ├── hooks/            # 自定义 Hooks (如 useReservation)
│   ├── lib/              # 工具库 (JWT 处理, Axios 封装)
│   ├── services/         # API 服务层与 Mock 数据
│   └── types/            # TypeScript 类型定义
├── docs/                 # 项目文档
│   └── architecture/     # 架构图、业务流程图与数据库设计
└── public/               # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn

### 安装步骤

1.  **克隆仓库**

    ```bash
    git clone https://github.com/yourusername/starstudy.git
    cd starstudy
    ```

2.  **安装依赖**

    ```bash
    npm install
    # 或者
    yarn install
    ```

3.  **启动开发服务器**

    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

4.  **访问应用**

    打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可看到应用。

## 📚 文档资源

项目的详细架构文档位于 `docs/architecture` 目录下：

- **[项目架构图](docs/architecture/project_architecture.drawio)**: 系统整体技术架构。
- **[业务流程图](docs/architecture/business_flows.drawio)**: 核心预订流程状态机。
- **[数据库设计](docs/architecture/database_design.drawio)**: 数据模型 ER 图。

*注：以上文件为 `.drawio` 格式，推荐使用 VS Code 插件或 diagrams.net 打开查看。*

## 🤝 贡献指南

1.  Fork 本仓库
2.  创建特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。
