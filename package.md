# DJI Web 项目 package.json 学习笔记

## 项目概述
- **项目名称**: demo-web
- **版本**: 0.0.1
- **许可证**: ISC
- **技术栈**: Vue 3 + Vite + TypeScript + Ant Design Vue

## 脚本命令 (scripts)

### 开发相关
- `serve`: 启动开发服务器 (`vite`)
- `preview`: 预览构建后的应用 (`vite preview`)

### 构建相关
- `build`: 生产环境构建 (`vite build`)
- `build:test`: 测试环境构建 (`vite build --mode stag`)

### 代码质量
- `lint`: ESLint 代码检查和自动修复 (`eslint --fix`)

## 核心依赖 (dependencies)

### 前端框架
- **vue**: ^3.2.26 - Vue 3 核心框架
- **vue-router**: 4 - Vue 路由管理
- **vuex**: ^4.0.2 - Vue 状态管理

### UI 组件库
- **ant-design-vue**: ^2.2.8 - Ant Design Vue 组件库
- **@ant-design/icons-vue**: ^6.0.1 - Ant Design 图标库

### 地图服务
- **@amap/amap-jsapi-loader**: ^1.0.1 - 高德地图 API 加载器

### 网络通信
- **axios**: ^0.21.1 - HTTP 请求库
- **mqtt**: ^4.3.7 - MQTT 协议客户端
- **reconnecting-websocket**: ^4.4.0 - 自动重连 WebSocket

### 实时音视频
- **agora-rtc-sdk-ng**: ^4.12.1 - 声网实时音视频 SDK

### 工具库
- **eventemitter3**: ^5.0.0 - 事件发射器
- **mitt**: ^3.0.0 - 轻量级事件总线
- **query-string**: ^7.0.1 - URL 查询字符串解析
- **vue-cookies**: ^1.7.4 - Vue Cookie 管理
- **vue-i18n**: ^9.1.6 - Vue 国际化

### 开发调试
- **vconsole**: ^3.8.1 - 移动端调试工具

### Vite 插件
- **vite-plugin-components**: ^0.13.3 - 组件自动导入
- **vite-plugin-importer**: ^0.2.5 - 样式自动导入
- **vite-plugin-optimize-persist**: ^0.1.2 - 依赖优化持久化
- **vite-plugin-package-config**: ^0.1.1 - 包配置插件

## 开发依赖 (devDependencies)

### TypeScript 支持
- **typescript**: ^4.5.4 - TypeScript 编译器
- **vue-tsc**: ^0.0.24 - Vue TypeScript 编译器
- **@types/node**: ^16.3.2 - Node.js 类型定义
- **@types/urlencode**: ^1.1.2 - URL 编码类型定义

### ESLint 代码检查
- **eslint**: ^7.30.0 - ESLint 核心
- **@typescript-eslint/eslint-plugin**: ^5.8.1 - TypeScript ESLint 插件
- **@typescript-eslint/parser**: ^5.8.1 - TypeScript ESLint 解析器
- **eslint-config-standard**: ^16.0.3 - 标准 ESLint 配置
- **eslint-plugin-import**: ^2.23.4 - 导入规则插件
- **eslint-plugin-node**: ^11.1.0 - Node.js 规则插件
- **eslint-plugin-promise**: ^5.1.0 - Promise 规则插件
- **eslint-plugin-vue**: ^7.13.0 - Vue 规则插件

### Vite 构建工具
- **vite**: ^2.4.0 - Vite 构建工具
- **@vitejs/plugin-vue**: ^1.2.4 - Vue 插件
- **@vitejs/plugin-legacy**: ^1.6.2 - 浏览器兼容性插件
- **@vue/compiler-sfc**: ^3.0.5 - Vue 单文件组件编译器

### Vite 插件
- **vite-plugin-eslint**: ^1.3.0 - ESLint 插件
- **vite-plugin-style-import**: ^1.0.1 - 样式导入插件
- **vite-plugin-svg-icons**: ^1.0.5 - SVG 图标插件
- **vite-plugin-vconsole**: ^1.1.0 - VConsole 插件

### 样式处理
- **sass**: ^1.35.1 - Sass 预处理器

### 其他工具
- **rollup-plugin-external-globals**: ^0.6.1 - Rollup 外部全局变量插件

## Vite 优化配置

### optimizeDeps 预构建依赖
项目配置了大量预构建依赖，包括：
- Vue 生态系统核心库
- Ant Design Vue 组件及其样式
- 地图、音视频、MQTT 等第三方库
- 工具库如 lodash、moment 等

这种配置可以：
1. 提高开发环境启动速度
2. 优化生产构建性能
3. 减少重复打包

## 项目特点分析

### 1. 无人机应用特色
- 集成高德地图用于飞行路径规划
- 使用 MQTT 协议进行设备通信
- 集成声网 SDK 支持实时音视频传输
- WebSocket 支持实时数据流

### 2. 现代化技术栈
- Vue 3 Composition API
- TypeScript 类型安全
- Vite 快速构建
- Ant Design Vue 企业级 UI

### 3. 开发体验优化
- ESLint 代码规范
- 组件和样式自动导入
- 移动端调试支持
- 国际化支持

### 4. 性能优化
- 依赖预构建
- 按需加载组件样式
- 浏览器兼容性支持

## 总结
这是一个功能完整的企业级无人机 Web 应用项目，技术栈现代化，开发工具链完善，特别针对无人机应用场景进行了优化配置。
