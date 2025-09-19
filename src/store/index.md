# Store 状态管理文档

## 概述

这是 DJI Web 应用的主要状态管理文件，使用 Vuex 进行全局状态管理。该 store 管理了设备信息、地图图层、直播流、MQTT 连接等核心功能的状态。

## 状态结构 (State)

### 核心状态模块

#### 1. 地图图层管理 (Layers)
```typescript
Layers: Array<LayerInfo>
```
- **default**: 默认图层
- **share**: 共享图层
- 每个图层包含：name, id, is_distributed, elements, is_check, is_select, type

#### 2. 设备状态管理 (deviceState)
```typescript
deviceState: {
  gatewayInfo: { [sn: string]: GatewayOsd },    // 网关设备信息
  deviceInfo: { [sn: string]: DeviceOsd },      // 无人机设备信息
  dockInfo: { [sn: string]: DockOsd },          // 机场设备信息
  currentSn: string,                            // 当前选中设备序列号
  currentType: number                           // 当前设备类型
}
```

#### 3. OSD 显示信息 (osdVisible)
```typescript
osdVisible: {
  sn: string,           // 设备序列号
  callsign: string,     // 呼号
  model: string,        // 设备型号
  visible: boolean,     // 是否显示
  gateway_sn: string,   // 网关序列号
  is_dock: boolean,    // 是否为机场
  payloads: any        // 载荷信息
}
```

#### 4. 直播流状态
- `drawVisible`: 绘图工具显示状态
- `livestreamOthersVisible`: 其他直播流显示状态
- `livestreamAgoraVisible`: Agora 直播流显示状态

#### 5. MQTT 连接状态
- `mqttState`: MQTT 实例
- `clientId`: MQTT 连接唯一客户端 ID

#### 6. 其他状态
- `waylineInfo`: 航线文件信息
- `dockInfo`: 机场设备信息
- `hmsInfo`: 设备健康管理系统信息
- `devicesCmdExecuteInfo`: 设备指令执行状态信息

## Mutations (状态变更)

### 设备信息相关
- `SET_DEVICE_INFO`: 设置无人机设备信息
- `SET_GATEWAY_INFO`: 设置网关设备信息
- `SET_DOCK_INFO`: 设置机场设备信息
- `SET_DEVICE_ONLINE`: 设备上线事件
- `SET_DEVICE_OFFLINE`: 设备离线事件（同时清理相关状态）

### 地图相关
- `SET_LAYER_INFO`: 设置图层信息
- `SET_MAP_ELEMENT_CREATE`: 地图元素创建事件
- `SET_MAP_ELEMENT_UPDATE`: 地图元素更新事件
- `SET_MAP_ELEMENT_DELETE`: 地图元素删除事件

### UI 状态相关
- `SET_DRAW_VISIBLE_INFO`: 设置绘图工具显示状态
- `SET_LIVESTREAM_OTHERS_VISIBLE`: 设置其他直播流显示状态
- `SET_LIVESTREAM_AGORA_VISIBLE`: 设置 Agora 直播流显示状态
- `SET_OSD_VISIBLE_INFO`: 设置 OSD 显示信息

### 其他功能
- `SET_SELECT_WAYLINE_INFO`: 设置选中的航线信息
- `SET_SELECT_DOCK_INFO`: 设置选中的机场信息
- `SET_DEVICE_HMS_INFO`: 设置设备 HMS 信息
- `SET_DEVICES_CMD_EXECUTE_INFO`: 设置设备指令执行信息
- `SET_MQTT_STATE`: 设置 MQTT 状态
- `SET_CLIENT_ID`: 设置客户端 ID

## Actions (异步操作)

### 图层管理
- `getAllElement`: 获取所有地图元素
- `updateElement`: 更新图层元素状态（选中/勾选）
- `setLayerInfo`: 设置图层基础信息
- `getLayerInfo`: 获取指定图层信息

## 使用方式

### 在组件中使用
```typescript
import { useMyStore } from '@/store'

export default {
  setup() {
    const store = useMyStore()
    
    // 获取状态
    const deviceInfo = store.state.deviceState.deviceInfo
    
    // 调用 actions
    store.dispatch('getAllElement')
    
    // 提交 mutations
    store.commit('SET_DEVICE_INFO', { sn: 'xxx', host: deviceData })
  }
}
```

### TypeScript 类型支持
- `RootStateType`: 根状态类型
- `AllStateStoreTypes`: 所有状态类型（包含模块）
- `storeKey`: Store 注入键

## 注意事项

1. **设备状态管理**: 设备离线时会自动清理相关状态信息
2. **图层管理**: 支持默认图层和共享图层的管理
3. **MQTT 连接**: 管理 MQTT 连接状态和客户端 ID
4. **指令执行**: 支持设备指令执行状态的跟踪和管理
5. **时间戳处理**: 设备指令执行信息会进行时间戳比较，丢弃过期消息

## 相关类型定义

主要依赖的类型文件：
- `../types/device`: 设备相关类型
- `../types/mapLayer`: 地图图层类型
- `../types/wayline`: 航线类型
- `../types/device-cmd`: 设备指令类型
