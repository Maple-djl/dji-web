<template>
  <div class="drc-stick-control-wrapper">
    <div class="drc-stick-control-header">DRC 杆量控制</div>

    <!-- 杆量控制面板 -->
    <div class="stick-control-panel">
      <!-- 横滚控制 -->
      <div class="stick-control-item">
        <label>横滚 (Roll)</label>
        <div class="stick-control">
          <a-button @mousedown="startRollLeft" @mouseup="stopRoll" @mouseleave="stopRoll">
            ← 左
          </a-button>
          <a-button @mousedown="startRollRight" @mouseup="stopRoll" @mouseleave="stopRoll">
            右 →
          </a-button>
        </div>
      </div>

      <!-- 俯仰控制 -->
      <div class="stick-control-item">
        <label>俯仰 (Pitch)</label>
        <div class="stick-control">
          <a-button @mousedown="startPitchBack" @mouseup="stopPitch" @mouseleave="stopPitch">
            ↑ 后
          </a-button>
          <a-button @mousedown="startPitchForward" @mouseup="stopPitch" @mouseleave="stopPitch">
            前 ↓
          </a-button>
        </div>
      </div>

      <!-- 升降控制 -->
      <div class="stick-control-item">
        <label>升降 (Throttle)</label>
        <div class="stick-control">
          <a-button @mousedown="startThrottleDown" @mouseup="stopThrottle" @mouseleave="stopThrottle">
            ↓ 降
          </a-button>
          <a-button @mousedown="startThrottleUp" @mouseup="stopThrottle" @mouseleave="stopThrottle">
            升 ↑
          </a-button>
        </div>
      </div>

      <!-- 偏航控制 -->
      <div class="stick-control-item">
        <label>偏航 (Yaw)</label>
        <div class="stick-control">
          <a-button @mousedown="startYawLeft" @mouseup="stopYaw" @mouseleave="stopYaw">
            ↶ 左转
          </a-button>
          <a-button @mousedown="startYawRight" @mouseup="stopYaw" @mouseleave="stopYaw">
            右转 ↷
          </a-button>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="reset-section">
        <a-button @click="resetStickValues" type="primary" danger>
          重置杆量
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMyStore } from '/@/store'
import { useMqtt } from './use-mqtt'

export default defineComponent({
  name: 'DrcStickControl',
  props: {
    sn: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useMyStore()

    // 杆量值 (1024为中值)
    const stickValues = reactive({
      roll: 1024, // 横滚
      pitch: 1024, // 俯仰
      throttle: 1024, // 升降
      yaw: 1024 // 偏航
    })

    // 控制状态
    const controlState = reactive({
      roll: 0, // -1: 左, 0: 停止, 1: 右
      pitch: 0, // -1: 后, 0: 停止, 1: 前
      throttle: 0, // -1: 降, 0: 停止, 1: 升
      yaw: 0 // -1: 左转, 0: 停止, 1: 右转
    })

    // 发送相关
    const sequenceNumber = ref(0)
    const sendInterval = ref<any>(null)

    // MQTT相关 - 复用现有的连接
    const deviceTopicInfo = reactive({
      sn: props.sn,
      pubTopic: '',
      subTopic: ''
    })
    const mqttHooks = useMqtt(deviceTopicInfo)

    // 监听DRC连接状态
    const drcConnected = computed(() => {
      return !!(store.state.mqttState && deviceTopicInfo.pubTopic)
    })

    // 开始发送杆量控制
    function startSendingStickControl () {
      if (sendInterval.value) return

      sendInterval.value = setInterval(() => {
        if (!drcConnected.value || !deviceTopicInfo.pubTopic) return

        const body = {
          seq: sequenceNumber.value++,
          method: 'stick_control',
          data: {
            roll: stickValues.roll,
            pitch: stickValues.pitch,
            throttle: stickValues.throttle,
            yaw: stickValues.yaw
          }
        }

        mqttHooks?.publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 0 })
      }, 100) // 10Hz
    }

    // 停止发送杆量控制
    function stopSendingStickControl () {
      if (sendInterval.value) {
        clearInterval(sendInterval.value)
        sendInterval.value = null
      }
    }

    // 更新杆量值
    function updateStickValue (channel: 'roll' | 'pitch' | 'throttle' | 'yaw', direction: number) {
      const STEP = 50
      const MIN = 364
      const MAX = 1684
      const NEUTRAL = 1024

      if (direction === 0) {
        stickValues[channel] = NEUTRAL
      } else {
        stickValues[channel] = Math.max(MIN, Math.min(MAX, stickValues[channel] + direction * STEP))
      }
    }

    // 横滚控制
    function startRollLeft () {
      controlState.roll = -1
      updateStickValue('roll', -1)
      startSendingStickControl()
    }

    function startRollRight () {
      controlState.roll = 1
      updateStickValue('roll', 1)
      startSendingStickControl()
    }

    function stopRoll () {
      controlState.roll = 0
      updateStickValue('roll', 0)
    }

    // 俯仰控制
    function startPitchBack () {
      controlState.pitch = -1
      updateStickValue('pitch', -1)
      startSendingStickControl()
    }

    function startPitchForward () {
      controlState.pitch = 1
      updateStickValue('pitch', 1)
      startSendingStickControl()
    }

    function stopPitch () {
      controlState.pitch = 0
      updateStickValue('pitch', 0)
    }

    // 升降控制
    function startThrottleDown () {
      controlState.throttle = -1
      updateStickValue('throttle', -1)
      startSendingStickControl()
    }

    function startThrottleUp () {
      controlState.throttle = 1
      updateStickValue('throttle', 1)
      startSendingStickControl()
    }

    function stopThrottle () {
      controlState.throttle = 0
      updateStickValue('throttle', 0)
    }

    // 偏航控制
    function startYawLeft () {
      controlState.yaw = -1
      updateStickValue('yaw', -1)
      startSendingStickControl()
    }

    function startYawRight () {
      controlState.yaw = 1
      updateStickValue('yaw', 1)
      startSendingStickControl()
    }

    function stopYaw () {
      controlState.yaw = 0
      updateStickValue('yaw', 0)
    }

    // 重置杆量
    function resetStickValues () {
      stickValues.roll = 1024
      stickValues.pitch = 1024
      stickValues.throttle = 1024
      stickValues.yaw = 1024
      stopSendingStickControl()
    }

    // 监听DRC连接状态变化
    watch(drcConnected, (connected) => {
      if (connected) {
        console.log('🎮 DRC连接已建立，开始杆量控制')
        startSendingStickControl()
      } else {
        console.log('🎮 DRC连接断开，停止杆量控制')
        stopSendingStickControl()
      }
    })

    onUnmounted(() => {
      stopSendingStickControl()
    })

    return {
      stickValues,
      startRollLeft,
      startRollRight,
      stopRoll,
      startPitchBack,
      startPitchForward,
      stopPitch,
      startThrottleDown,
      startThrottleUp,
      stopThrottle,
      startYawLeft,
      startYawRight,
      stopYaw,
      resetStickValues
    }
  }
})
</script>

<style lang="scss" scoped>
.drc-stick-control-wrapper {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  min-width: 300px;
}

.drc-stick-control-header {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.stick-control-panel {
  background: #2a2a2a;
  padding: 16px;
  border-radius: 4px;
}

.stick-control-item {
  margin-bottom: 16px;

  label {
    display: block;
    color: #fff;
    font-size: 14px;
    margin-bottom: 8px;
  }
}

.stick-control {
  display: flex;
  gap: 8px;
  align-items: center;

  .ant-btn {
    flex: 1;
    height: 36px;
    font-size: 12px;
  }
}

.reset-section {
  margin-top: 20px;
  text-align: center;

  .ant-btn {
    width: 100%;
    height: 40px;
    font-size: 14px;
  }
}
</style>
