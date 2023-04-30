<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图纸" name="canvas">
        <el-form label-width="100px" label-position="left" size="small">
          <el-collapse v-model="activeCollapse">
            <el-collapse-item name="canvas" title="画布">
              <div class="collapse-content">
                <el-form-item label="默认颜色">
                  <el-color-picker
                    v-model="canvasOption.color"
                    @change="onChangeCanvasOption"
                    show-alpha
                    :predefine="colorPredefine"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="背景颜色">
                  <el-color-picker
                    @change="onChangeBackgroundColor"
                    v-model="backgroundColor"
                    show-alpha
                    :predefine="colorPredefine"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="背景网格">
                  <el-switch v-model="gridOption.grid" @change="onChangeGridOption"></el-switch>
                </el-form-item>
                <el-form-item label="网格颜色">
                  <el-color-picker
                    v-model="gridOption.gridColor"
                    @change="onChangeGridOption"
                    show-alpha
                    :predefine="colorPredefine"
                    color-format="hex"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="网格大小">
                  <el-input-number
                    :controls="false"
                    v-model="gridOption.gridSize"
                    @change="onChangeGridOption"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="网格角度">
                  <el-input-number
                    :controls="false"
                    v-model="gridOption.gridRotate"
                    @change="onChangeGridOption"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="标尺">
                  <el-switch v-model="ruleOption.rule" @change="onChangeRuleOption"></el-switch>
                </el-form-item>
                <el-form-item label="标尺颜色">
                  <el-color-picker
                    v-model="ruleOption.ruleColor"
                    @change="onChangeRuleOption"
                    show-alpha
                    :predefine="colorPredefine"
                  ></el-color-picker>
                </el-form-item>
                <!-- <el-form-item label="自动缩放">
                  <el-switch v-model="canvasOption.autoFit" @change="onChangeAutoFit"></el-switch>
                </el-form-item> -->
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通信" name="network">
        <el-form label-position="left" size="small">
          <el-collapse v-model="activeSocketCollapse">
            <el-collapse-item name="websocket" title="WebSocket">
              <div style="padding: 0 10px">
                <el-input
                  style="width: 100%"
                  size="small"
                  v-model="websocketUrl"
                  @change="onChangeWebsocketUrl"
                ></el-input>
              </div>
            </el-collapse-item>
            <!-- <el-collapse-item name="http" title="Http">
              <div style="padding: 0 10px">
                <el-form-item label="URL地址">
                  <el-input v-model="httpUrl"></el-input>
                </el-form-item>
                <el-form-item label="时间间隔">
                  <el-input-number :controls="false" v-model="httpInterval"></el-input-number>
                </el-form-item>
              </div>
            </el-collapse-item> -->
            <el-collapse-item name="js" title="js处理脚本">
              <div style="padding: 0 10px">
                <el-form-item>
                  <el-input
                    type="textarea"
                    size="small"
                    :rows="10"
                    v-model="socketFn"
                    @change="onChangeSocketFn"
                  ></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="布局" name="layout">
        <el-form label-width="80px" label-position="left" size="small">
          <el-collapse v-model="activeLayoutCollapse">
            <el-collapse-item name="layout" title="布局">
              <div style="padding: 0 10px">
                <el-form-item label="最大宽度">
                  <el-input-number :controls="false" v-model="maxWidth"></el-input-number>
                </el-form-item>

                <el-form-item label="间距">
                  <el-input-number :controls="false" v-model="spaceDistance"></el-input-number>
                </el-form-item>

                <el-button style="width: 100%" @click="onLayout">开始布局</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="结构" name="structure">
        <editor-props-tab-structure />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ColorPredefine } from '../constant'
  import EditorPropsTabStructure from '@/components/TopologyEditor/EditorProps/EditorPropsTabStructure.vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const window: any
  defineOptions({
    name: 'EditorPropsCanvas'
  })

  onMounted(() => {
    websocketUrl.value = window.meta2d.store.data.websocket
  })

  const activeName = ref('canvas')
  const activeCollapse = ref('canvas')
  const activeSocketCollapse = ref(['websocket', 'js'])
  const colorPredefine = ref(ColorPredefine)
  const canvasOption = reactive({
    penBackground: '#ffffff00',
    color: '#000000'
  })
  const backgroundColor = ref('#f4f4f4')
  const gridOption = reactive({
    grid: false,
    gridColor: '#e2e2e2',
    gridSize: 20,
    gridRotate: 0
  })
  const ruleOption = reactive({
    rule: false,
    ruleColor: '#888888'
  })
  const websocketUrl = ref(null)
  const socketFn = ref(null)
  const activeLayoutCollapse = ref('layout')
  const maxWidth = ref(100)
  const spaceDistance = ref(0)

  function onChangeCanvasOption() {
    window.meta2d.setOptions(canvasOption)
    window.meta2d.render()
  }
  function onChangeBackgroundColor() {
    window.meta2d.setBackgroundColor(backgroundColor.value)
    window.meta2d.render()
  }
  function onChangeGridOption() {
    window.meta2d.setGrid(gridOption)
    window.meta2d.render()
  }
  function onChangeRuleOption() {
    window.meta2d.setRule(ruleOption)
    window.meta2d.render()
  }
  function onLayout() {
    window.meta2d.layout(undefined, maxWidth.value, spaceDistance.value)
  }
  function onChangeWebsocketUrl() {
    if (websocketUrl.value) {
      window.meta2d.connectWebsocket(websocketUrl.value)
    } else {
      window.meta2d.store.data.websocket = null
      window.meta2d.closeWebsocket()
    }
  }
  function onChangeSocketFn() {
    window.meta2d.store.data.socketCbJs = socketFn.value
    window.meta2d.listenSocket()
  }
</script>

<style>
  .collapse-title {
    padding: 0 0 0 10px;
  }

  .collapse-content {
    padding: 0 0 0 10px;
  }
</style>
