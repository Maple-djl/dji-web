# use-manual-control.ts 使用手册

## 📋 概述

`use-manual-control.ts` 是一个Vue 3组合式API Hook，用于处理无人机的手动控制功能。它提供了键盘和鼠标控制无人机的接口，支持WASD键位控制和方向键控制。

## 🎯 主要功能

### 1. 键盘控制
- **W键**: 向前移动 (`x: SPEED`)
- **S键**: 向后移动 (`x: -SPEED`) 
- **A键**: 向左移动 (`y: -SPEED`)
- **D键**: 向右移动 (`y: SPEED`)
- **Q键**: 逆时针旋转 (`w: -W_SPEED`)
- **E键**: 顺时针旋转 (`w: W_SPEED`)
- **↑键**: 上升 (`h: HEIGHT`)
- **↓键**: 下降 (`h: -HEIGHT`)

### 2. 控制参数
```typescript
const SPEED = 5        // 移动速度
const HEIGHT = 5       // 升降高度
const W_SPEED = 20     // 旋转角速度
```

## 🔧 API接口

### 函数签名
```typescript
export function useManualControl(
  deviceTopicInfo: DeviceTopicInfo, 
  isCurrentFlightController: Ref<boolean>
)
```

### 返回值
```typescript
{
  handleKeyup: (keyCode: KeyCode) => void,
  handleEmergencyStop: () => void,
  resetControlState: () => void
}
```

## 📡 通信协议

### MQTT消息格式
```json
{
  "method": "drone_control",
  "data": {
    "x": 5,           // 前后移动 (正数向前，负数向后)
    "y": 5,           // 左右移动 (正数向右，负数向左)
    "h": 5,           // 升降控制 (正数上升，负数下降)
    "w": 20,          // 旋转控制 (正数顺时针，负数逆时针)
    "seq": 1          // 序列号
  }
}
```

### 发送频率
- **控制命令**: 每50ms发送一次
- **QoS等级**: 0 (最多一次传递)

## 🎮 使用示例

### 在组件中使用
```typescript
import { useManualControl } from './use-manual-control'

export default defineComponent({
  setup() {
    const deviceTopicInfo = reactive({
      sn: 'device-sn',
      pubTopic: 'topic/path',
      subTopic: 'topic/path'
    })
    
    const flightController = ref(false)
    
    const {
      handleKeyup,
      handleEmergencyStop,
      resetControlState
    } = useManualControl(deviceTopicInfo, flightController)
    
    // 鼠标按下事件
    function onMouseDown(type: KeyCode) {
      handleKeyup(type)
    }
    
    // 鼠标松开事件
    function onMouseUp() {
      resetControlState()
    }
    
    return {
      onMouseDown,
      onMouseUp,
      handleEmergencyStop
    }
  }
})
```

### 模板绑定
```html
<template>
  <div class="control-panel">
    <!-- W键控制 -->
    <Button @mousedown="onMouseDown(KeyCode.KEY_W)" @onmouseup="onMouseUp">
      W
    </Button>
    
    <!-- 紧急停止 -->
    <Button @click="handleEmergencyStop" type="danger">
      紧急停止
    </Button>
  </div>
</template>
```

## 🔍 调试信息

### 控制台日志
```typescript
// 按键处理日志
console.log('handleKeyup called with:', keyCode)
console.log('deviceTopicInfo:', deviceTopicInfo)
console.log('isCurrentFlightController:', isCurrentFlightController.value)

// 发布命令日志
console.log('handlePublish called with params:', params)
console.log('pubTopic:', deviceTopicInfo.pubTopic)
console.log('Publishing to topic:', deviceTopicInfo.pubTopic, 'body:', body)

// 按键状态日志
window.console.log('keyCode>>>>', activeCodeKey.value, body)
```

## ⚠️ 错误处理

### 常见错误检查
1. **DRC链路检查**
   ```typescript
   if (!deviceTopicInfo.pubTopic) {
     console.error('DRC链路未建立 - pubTopic为空:', deviceTopicInfo.pubTopic)
     message.error('请确保已经建立DRC链路')
     return
   }
   ```

2. **飞行控制权检查**
   ```typescript
   if (!isCurrentFlightController.value) {
     console.error('未获取飞行控制权')
     message.error('请先获取飞行控制权')
     return
   }
   ```

## 🔄 状态管理

### 活动按键状态
```typescript
const activeCodeKey = ref(null) as Ref<KeyCode | null>
```

### 序列号管理
```typescript
let seq = 0  // 命令序列号，每次发送递增
```

### 定时器管理
```typescript
let myInterval: any  // 控制命令发送定时器
```

## 🛠️ 内部函数

### handlePublish
- **功能**: 发布控制命令到MQTT
- **参数**: `DroneControlProtocol` 控制协议数据
- **频率**: 50ms间隔

### handleClearInterval
- **功能**: 清除发送定时器
- **用途**: 停止连续发送命令

### resetControlState
- **功能**: 重置控制状态
- **操作**: 清除活动按键、重置序列号、停止定时器

## 📋 依赖项

### 外部依赖
- `useMqtt`: MQTT连接管理
- `DRC_METHOD`: DRC方法常量
- `DroneControlProtocol`: 控制协议类型

### 类型定义
```typescript
enum KeyCode {
  KEY_W = 'KeyW',
  KEY_S = 'KeyS', 
  KEY_A = 'KeyA',
  KEY_D = 'KeyD',
  KEY_Q = 'KeyQ',
  KEY_E = 'KeyE',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown'
}
```

## 🎯 最佳实践

### 1. 连接检查
使用前确保：
- MQTT连接已建立
- DRC链路已建立
- 已获取飞行控制权

### 2. 错误处理
- 监听控制台错误日志
- 处理连接断开情况
- 提供用户友好的错误提示

### 3. 性能优化
- 及时清理定时器
- 避免重复按键处理
- 合理设置发送频率

## 🔧 故障排除

### 常见问题
1. **命令无响应**
   - 检查DRC连接状态
   - 确认飞行控制权
   - 验证Topic路径

2. **连接断开**
   - 重新建立MQTT连接
   - 重新进入DRC模式
   - 检查网络状态

3. **控制延迟**
   - 检查网络延迟
   - 调整发送频率
   - 优化MQTT配置

## 📚 相关文档

- [use-mqtt.ts](./use-mqtt.md) - MQTT连接管理
- [DroneControlPanel.vue](./DroneControlPanel.md) - 控制面板组件
- [DRC协议文档](../api/drc.md) - DRC通信协议

---

*最后更新: 2024年*
