# use-mqtt.ts 文档

## 概述

`use-mqtt.ts` 是一个 Vue 3 Composition API Hook，用于管理 MQTT 连接和消息通信。主要用于处理无人机控制相关的 MQTT 消息订阅、发布和心跳机制。

## 接口定义

### DeviceTopicInfo

```typescript
interface DeviceTopicInfo {
  sn: string        // 设备序列号
  pubTopic: string  // 发布主题
  subTopic: string  // 订阅主题
}
```

### MessageMqtt

```typescript
type MessageMqtt = (topic: string, payload: Buffer, packet: IPublishPacket) => void | Promise<void>
```

## 主要功能

### 1. MQTT 消息发布

```typescript
function publishMqtt(topic: string, body: object, ots?: IClientPublishOptions)
```

- **功能**: 发布 MQTT 消息到指定主题
- **参数**:
  - `topic`: 目标主题
  - `body`: 消息体对象
  - `ots`: 可选的发布选项（如 QoS 级别）
- **实现**: 将对象序列化为 JSON 字符串后发布

### 2. MQTT 消息订阅

```typescript
function subscribeMqtt(topic: string, handleMessageMqtt?: MessageMqtt)
```

- **功能**: 订阅指定主题的 MQTT 消息
- **参数**:
  - `topic`: 订阅的主题
  - `handleMessageMqtt`: 可选的自定义消息处理函数
- **实现**: 
  - 订阅主题
  - 注册消息处理函数
  - 将订阅信息缓存到 `cacheSubscribeArr` 数组

### 3. 消息处理

```typescript
function onMessageMqtt(message: any)
```

- **功能**: 处理接收到的 MQTT 消息
- **处理流程**:
  1. 检查消息主题是否在订阅列表中
  2. 将 Buffer 类型的 payload 解码为 UTF-8 字符串
  3. 解析 JSON 格式的消息体
  4. 根据 `method` 字段分发到不同的处理逻辑

#### 支持的消息类型

| Method | 处理方式 | 说明 |
|--------|----------|------|
| `HEART_BEAT` | 忽略 | 心跳消息 |
| `DELAY_TIME_INFO_PUSH` | 发送到 EventBus | 延迟时间信息推送 |
| `HSI_INFO_PUSH` | 发送到 EventBus | HSI 信息推送 |
| `OSD_INFO_PUSH` | 发送到 EventBus | OSD 信息推送 |
| `DRONE_CONTROL` | 发送到 EventBus | 无人机控制指令 |
| `DRONE_EMERGENCY_STOP` | 发送到 EventBus | 无人机紧急停止 |

### 4. 心跳机制

```typescript
function publishDrcPing(sn: string)
```

- **功能**: 向指定设备发送心跳包
- **实现**:
  - 创建心跳消息体，包含时间戳和序列号
  - 每秒发送一次心跳包
  - 使用 QoS 0 级别
  - 管理心跳定时器状态

#### 心跳消息格式

```typescript
{
  method: DRC_METHOD.HEART_BEAT,
  data: {
    ts: number,    // 时间戳
    seq: number    // 序列号
  }
}
```

### 5. 订阅管理

```typescript
function unsubscribeDrc()
```

- **功能**: 取消所有 MQTT 订阅
- **实现**:
  - 遍历缓存的订阅列表
  - 移除消息监听器
  - 取消主题订阅
  - 清空缓存数组

## 状态管理

### 响应式状态

- `mqttState`: 从 store 中获取的 MQTT 连接状态
- `heartBeatSeq`: 心跳序列号计数器
- `state.heartState`: Map 类型，存储每个设备的心跳定时器

### 缓存管理

- `cacheSubscribeArr`: 存储所有订阅信息，用于统一管理和清理

## 生命周期管理

### 监听设备主题变化

```typescript
watch(() => deviceTopicInfo, (val, oldVal) => {
  if (val.subTopic !== '') {
    // 订阅新主题并开始心跳
    subscribeMqtt(deviceTopicInfo.subTopic)
    publishDrcPing(deviceTopicInfo.sn)
  } else {
    // 清理心跳定时器
    clearInterval(state.heartState.get(deviceTopicInfo.sn)?.pingInterval)
    state.heartState.delete(deviceTopicInfo.sn)
    heartBeatSeq.value = 0
  }
}, { immediate: true, deep: true })
```

### 组件卸载清理

```typescript
onUnmounted(() => {
  unsubscribeDrc()      // 取消所有订阅
  heartBeatSeq.value = 0 // 重置心跳序列号
})
```

## 返回值

Hook 返回以下方法和状态：

```typescript
{
  mqttState,      // MQTT 连接状态
  publishMqtt,    // 发布消息方法
  subscribeMqtt,  // 订阅消息方法
}
```

## 使用示例

```typescript
import { useMqtt } from './use-mqtt'

// 在组件中使用
const deviceInfo = {
  sn: 'device123',
  pubTopic: 'device/123/pub',
  subTopic: 'device/123/sub'
}

const { mqttState, publishMqtt, subscribeMqtt } = useMqtt(deviceInfo)

// 发布控制指令
publishMqtt('device/123/pub', {
  method: 'DRONE_CONTROL',
  data: { action: 'takeoff' }
})
```

## 注意事项

1. **内存管理**: Hook 会自动管理订阅和心跳定时器，组件卸载时会自动清理
2. **错误处理**: 消息解析失败时可能会抛出异常，建议在使用时添加 try-catch
3. **性能考虑**: 心跳间隔为 1 秒，频繁的设备切换可能影响性能
4. **EventBus 依赖**: 部分消息会通过 EventBus 分发，确保相关组件已注册对应的事件监听器

## 依赖项

- Vue 3 Composition API
- MQTT 客户端库
- Pinia Store
- EventBus 事件总线
- DRC 类型定义
