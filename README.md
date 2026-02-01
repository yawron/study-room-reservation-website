# StarStudy

StarStudy 是一个高端校园自习室预订平台，致力于提供优质的学习环境体验。项目采用 Next.js 全栈框架构建，集成了预订管理和用户评价系统。

## 功能特性

- **空间浏览**：按类型和容量筛选自习室
- **实时预订**：可视化日期与时间选择
- **用户认证**：基于 JWT 的安全登录与注册
- **评价系统**：用户评分与评论
- **响应式设计**：适配桌面与移动端
- **个人中心**：查看预订记录及状态

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **工具**: Lucide React, Axios, Jose (JWT)

## 目录结构

src/
├── app/              # 页面与 API 路由
├── components/       # UI 组件
├── context/          # 全局状态
├── hooks/            # 自定义 Hooks
├── lib/              # 工具库
├── services/         # API 服务与 Mock 数据
└── types/            # 类型定义

## 快速开始

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/starstudy.git
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

访问 http://localhost:3000

## 文档资源

详细文档位于 `docs/architecture` 目录下，包含架构图、业务流程图与数据库设计。

## 许可证

MIT License
