// 调试环境变量加载
console.log('Environment variables:', {
  VITE_APP_ID: import.meta.env.VITE_APP_ID,
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
})

export const CURRENT_CONFIG = {

  // license - 您申请的DJI Cloud API许可证 (硬编码)
  appId: '161476', // 您的App ID
  appKey: '9437ef02cb06c19c91795e8e99e6243', // 您的App Key
  appLicense: 'ZjlT38x//cTLTykle1cze4AtD8IYCKKrRtJs0XGGk16BSlJRy9/NfCGG32S9/Tw3W12AsO/bkwxsclBw0H6yKxYTpR6FljmQuJE7mu5JFPRjNKYrfIqi7q4bxecSjGXdx/dy7igKfPe6luOOS/vzol4LEvywzRPUHE+6RoyQ9e4=', // 您的App License

  // http - 后端服务地址
  baseURL: import.meta.env.VITE_BASE_URL || 'http://192.168.31.223:6789/', // 后端API地址
  websocketURL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://192.168.31.223:6789/api/v1/ws', // WebSocket地址

  // livestreaming - 直播流配置
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: import.meta.env.VITE_RTMP_URL || 'rtmp://192.168.31.223:1935/live/', // RTMP流地址
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.
  gbServerIp: import.meta.env.VITE_GB_SERVER_IP || '192.168.31.223',
  gbServerPort: import.meta.env.VITE_GB_SERVER_PORT || '5060',
  gbServerId: import.meta.env.VITE_GB_SERVER_ID || 'your_gb_server_id',
  gbAgentId: import.meta.env.VITE_GB_AGENT_ID || 'your_gb_agent_id',
  gbPassword: import.meta.env.VITE_GB_PASSWORD || 'your_gb_password',
  gbAgentPort: import.meta.env.VITE_GB_AGENT_PORT || '5060',
  gbAgentChannel: import.meta.env.VITE_GB_AGENT_CHANNEL || 'your_gb_channel',
  // RTSP
  rtspUserName: import.meta.env.VITE_RTSP_USERNAME || 'your_rtsp_username',
  rtspPassword: import.meta.env.VITE_RTSP_PASSWORD || 'your_rtsp_password',
  rtspPort: import.meta.env.VITE_RTSP_PORT || '8554',
  // Agora
  agoraAPPID: import.meta.env.VITE_AGORA_APP_ID || 'your_agora_app_id',
  agoraToken: import.meta.env.VITE_AGORA_TOKEN || 'your_agora_token',
  agoraChannel: import.meta.env.VITE_AGORA_CHANNEL || 'your_agora_channel',

  // map - 高德地图配置
  // You can apply on the AMap website.
  amapKey: import.meta.env.VITE_AMAP_KEY || '4846f53dd7ee912f227720624b9a436c', // 您的高德地图API Key

}
