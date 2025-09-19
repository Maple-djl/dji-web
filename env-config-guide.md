# DJI Cloud API Web 环境配置指南

## 📋 配置文件说明

### 1. 主要配置文件
- **`src/api/http/config.ts`** - 主要配置文件（已更新）
- **`.env.development`** - 开发环境变量文件（需要创建）

### 2. 您申请的License信息
```typescript
// 已配置的License信息
appId: '161476'
appKey: '9437ef02cb06c19c91795e8e99e6243'
appLicense: 'ZjlT38x//cTLTykle1cze4AtD8IYCKKrRtJs0XGGk16BSlJRy9/NfCGG32S9/Tw3W12AsO/bkwxsclBw0H6yKxYTpR6FljmQuJE7mu5JFPRjNKYrfIqi7q4bxecSjGXdx/dy7igKfPe6luOOS/vzol4LEvywzRPUHE+6RoyQ9e4='
```

## 🔧 创建环境配置文件

### 创建 `.env.development` 文件

在项目根目录 `E:\dji\dji-web\` 下创建 `.env.development` 文件：

```env
# DJI Cloud API Web 开发环境配置

# 应用凭证 (您申请的license)
VITE_APP_ID=161476
VITE_APP_KEY=9437ef02cb06c19c91795e8e99e6243
VITE_APP_LICENSE=ZjlT38x//cTLTykle1cze4AtD8IYCKKrRtJs0XGGk16BSlJRy9/NfCGG32S9/Tw3W12AsO/bkwxsclBw0H6yKxYTpR6FljmQuJE7mu5JFPRjNKYrfIqi7q4bxecSjGXdx/dy7igKfPe6luOOS/vzol4LEvywzRPUHE+6RoyQ9e4=

# HTTP接口配置
VITE_BASE_URL=http://192.168.31.108:6789/
VITE_WEBSOCKET_URL=ws://192.168.31.108:6789/api/v1/ws

# 直播流配置
VITE_RTMP_URL=rtmp://192.168.31.108:1935/live/
VITE_AGORA_APP_ID=your_agora_app_id
VITE_AGORA_TOKEN=your_agora_token
VITE_AGORA_CHANNEL=your_agora_channel

# 地图配置 (高德地图)
VITE_AMAP_KEY=4846f53dd7ee912f227720624b9a436c

# GB28181配置 (如果需要)
VITE_GB_SERVER_IP=192.168.31.108
VITE_GB_SERVER_PORT=5060
VITE_GB_SERVER_ID=your_gb_server_id
VITE_GB_AGENT_ID=your_gb_agent_id
VITE_GB_PASSWORD=your_gb_password
VITE_GB_AGENT_PORT=5060
VITE_GB_AGENT_CHANNEL=your_gb_channel

# RTSP配置 (如果需要)
VITE_RTSP_USERNAME=your_rtsp_username
VITE_RTSP_PASSWORD=your_rtsp_password
VITE_RTSP_PORT=8554
```

## 🚀 配置完成后的操作

### 1. 启动后端服务
```bash
cd E:\dji\dji-api\sample
mvn spring-boot:run
```

### 2. 启动前端服务
```bash
cd E:\dji\dji-web
npm run serve
```

### 3. 访问应用
- **Web端**: http://localhost:8080
- **Pilot端**: 通过DJI Pilot2访问

## ✅ 配置验证

### 1. 检查License验证
- 打开浏览器控制台
- 查看是否有License验证成功的消息
- 确认没有"Please enter the app id"等提示

### 2. 检查网络连接
- 确认后端服务运行在 `http://192.168.31.108:6789/`
- 测试WebSocket连接是否正常
- 验证API接口是否可访问

### 3. 检查地图服务
- 确认高德地图API Key有效
- 测试地图加载是否正常

## 🔍 故障排除

### 1. License验证失败
- 检查App ID、App Key、App License是否正确
- 确认网络连接正常
- 验证后端服务是否运行

### 2. 网络连接问题
- 检查IP地址 `192.168.31.108` 是否正确
- 确认端口 `6789` 是否开放
- 测试防火墙设置

### 3. 地图加载失败
- 检查高德地图API Key是否有效
- 确认API Key有相应的权限
- 检查网络连接

## 📝 注意事项

### 1. 安全提醒
- 不要将License信息提交到公共代码仓库
- 使用环境变量管理敏感信息
- 定期更新API Key

### 2. 网络配置
- 确保设备在同一网络环境中
- 检查防火墙和端口设置
- 确认网络稳定性

### 3. 设备兼容性
- 确认您的设备（Matrice 4E + DJI RC Plus 2）是否支持
- 检查设备固件版本
- 验证设备连接状态

## 🎯 下一步操作

1. **创建 `.env.development` 文件**
2. **启动后端服务**
3. **启动前端服务**
4. **测试License验证**
5. **连接设备进行测试**

配置完成后，您就可以开始使用DJI Cloud API Web应用了！
