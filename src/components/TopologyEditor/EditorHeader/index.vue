<template>
  <div class="editor-header">
    <div class="manage-icon">
      <editor-button class="file-button" :iconClass="'t-folder'">
        导入<input class="input-file" type="file" @change="onOpen" />
      </editor-button>
      <editor-button @click="onCreate" :iconClass="'t-file-add'">清空</editor-button>
      <editor-button @click="onSave" :iconClass="'t-save'">保存</editor-button>
      <editor-button @click="onExport" :iconClass="'t-miaoshuliebiao'">导出</editor-button>
      <editor-button @click="onRelease" :iconClass="'t-miaoshuliebiao'">发布</editor-button>
      <editor-button @click="onLock" :class="{ active: lockState === 2 }" :iconClass="lockIcons"
        >{{ lockStateText }}
      </editor-button>
      <editor-button :iconClass="'t-help'" @click="onHelp">帮助</editor-button>
    </div>
    <div class="manage-icon">
      <editor-button :class="{ active: isPenActive }" :iconClass="'t-curve'" @click="onTogglePen">钢笔</editor-button>
      <editor-button :class="{ active: isPencilActive }" :iconClass="'t-qianbi'" @click="onTogglePencil"
        >铅笔
      </editor-button>
      <editor-button :class="{ active: isMagnifierActive }" :iconClass="'t-fangdajing'" @click="onToggleMagnifier">
        放大镜
      </editor-button>

      <el-dropdown placement="bottom-start" @command="onChangeLineStart">
        <editor-button :iconClass="`t-from-${currentLineFrom}`">起点样式</editor-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in lineEndsTypeEnum" :key="index" :command="item">
              <i style="font-size: 30px" :class="`t-icon t-from-${item}`"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom-start" @command="onChangeLineEnd">
        <editor-button :iconClass="`t-to-${currentLineTo}`">终点样式</editor-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, index) in lineEndsTypeEnum" :key="index" :command="item">
              <i style="font-size: 30px" :class="`t-icon t-to-${item}`"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom-start" @command="onChangeLineType">
        <editor-button :iconClass="LineTypeIcon[lineTypeName as keyof typeof LineTypeIcon]">
          {{ lineTypeName }}
        </editor-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              style="display: flex; justify-content: space-between"
              v-for="(item, index) in Object.keys(lineTypeEnum)"
              :key="index"
              :command="`${item}|${lineTypeEnum[item as keyof typeof LineType]}`"
            >
              <span style="margin-right: 10px">{{ item }}</span>
              <i :class="`t-icon ${LineTypeIcon[item as keyof typeof LineTypeIcon]}`"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom-start">
        <editor-button>
          <template #icon>
            <span style="line-height: 16px">{{ lineWidth }}</span>
          </template>
          线宽
        </editor-button>

        <template #dropdown>
          <el-dropdown-menu>
            <div class="drop-down-menu-wrapper">
              <el-input-number
                v-model="lineWidth"
                :min="1"
                :precision="0"
                controls-position="right"
                label="线宽"
              ></el-input-number>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom-start">
        <editor-button>
          <template #icon>
            <span>{{ currentScalePercent }} <i class="t-icon t-triangle-down"></i></span>
          </template>
          视图
        </editor-button>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="drop-down-menu-wrapper scale-dropdown-menu">
              <el-button @click="onScale(100)">重置</el-button>
              <el-input-number :step="10" v-model="currentScalePercent.value" :min="1"></el-input-number>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <editor-button
        :iconClass="`t-miaodianjiyong`"
        :style="{ color: isAutoAnchor ? '#CC9900' : '#ddd' }"
        @click="onToggleAutoAnchor"
        >自动锚点
      </editor-button>
      <editor-button :iconClass="isVisibleAnchor ? 't-jinzhimiaodian' : 't-final'" @click="onToggleVisibleAnchor"
        >{{ isVisibleAnchor ? '隐藏锚点' : '显示锚点' }}
      </editor-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LineType, LineTypeIcon, LineEndsType, PenType } from '../constant'
  import { LockState, type Pen } from '@meta2d/core'
  import EditorButton from './EditorButton.vue'
  import { ElMessage } from 'element-plus'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  const store = useTopologyEditorStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const window: any

  defineOptions({
    name: 'EditorHeader'
  })

  const isMagnifierActive = ref(false)
  const isPenActive = ref(false)
  const isPencilActive = ref(false)
  const isMinimapActive = ref(false)
  const lockState = ref(LockState.None)
  const lineTypeName = ref('曲线')
  const lineTypeEnum = LineType
  const lineWidth = ref(1)
  const lineEndsTypeEnum = LineEndsType
  const currentLineFrom = ref('')
  const currentLineTo = ref('')
  const isAutoAnchor = ref(true)
  const isVisibleAnchor = ref(true)

  const emit = defineEmits(['save'])

  const lockIcons = computed(() => {
    switch (lockState.value) {
      case LockState.None:
        return 't-unlock'
      case LockState.DisableEdit:
        return 't-lock'
      case LockState.DisableMove:
        return 't-wufayidong'
      default:
        return ''
    }
  })

  const currentScale = computed(() => store.editorScale)
  const currentScalePercent = computed({
    get: () => {
      return currentScale || ref(100)
    },
    set: (val) => {
      onScale(val.value)
    }
  })

  const lockStateText = computed(() => {
    switch (lockState.value) {
      case LockState.None:
        return '编辑'
      case LockState.DisableEdit:
        return '预览'
      case LockState.DisableMove:
        return '锁定'
      default:
        return ''
    }
  })

  /**
   * 更新active状态pen的属性
   * @param {*} props
   * @param {*, PenType.Node, PenType.Line, PenType.All } type
   */
  function _updateActivePen(props: Pen, penType = PenType.All) {
    const activeItem: Pen[] = window.meta2d.canvas.store.active
    activeItem.length &&
      activeItem.forEach((pen) => {
        if (penType === PenType.All) {
          window.meta2d.setValue({ id: pen.id, ...props }, { render: false, history: true })
        } else {
          if (pen.type === penType) {
            window.meta2d.setValue({ id: pen.id, ...props }, { render: false, history: true })
          }
        }
      })

    window.meta2d.render()
  }
  /**
   * 导入json文件
   */
  function onOpen(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files || []
    const file = files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const target = event.target as FileReader
        const json = JSON.parse(target.result as string)
        window.meta2d.open(json)
      } catch (e) {
        console.log('读取文件失败，请检查数据格式')
      }
    }
    reader.readAsText(file)
  }
  /**
   * 文件保存
   */
  function onSave() {
    emit('save')
  }
  /**
   *
   */
  function onExport() {
    const filename = 'topology.json'
    const data = window.meta2d.data()
    const json = JSON.stringify(data, undefined, 4)
    const blob = new Blob([json], { type: 'text/json' })
    const a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    a.click()
  }
  /**
   * 文件创建
   */
  function onCreate() {
    window.meta2d.open()
    window.meta2d.setBackgroundColor('#f4f4f4')
    ElMessage({
      message: '清空成功',
      type: 'success'
    })
  }
  /**
   * 视图编辑锁定
   */
  function onLock() {
    switch (lockState.value) {
      case LockState.None:
        lockState.value = LockState.DisableEdit
        break
      case LockState.DisableEdit:
        lockState.value = LockState.DisableMove
        break
      case LockState.DisableMove:
        lockState.value = LockState.None
        break
      default:
        break
    }

    window.meta2d.lock(lockState.value)
  }
  /**
   * 文件发布
   */
  function onRelease() {
    // 按照自己需求实现
    const data = window.meta2d.data()
    const json = JSON.stringify(data, undefined, 4)
    console.log('编辑器数据', json)

    ElMessage({
      message: '按照自己需求实现',
      type: 'warning'
    })
  }

  /**
   * 钢笔
   */
  function onTogglePen() {
    isPenActive.value = !isPenActive.value

    if (isPenActive.value) {
      window.meta2d.drawLine('curve')
      isPencilActive.value = false
      window.meta2d.finishPencil()
    } else {
      window.meta2d.finishDrawLine() && window.meta2d.drawLine()
    }
  }
  /**
   * 铅笔
   */
  function onTogglePencil() {
    isPencilActive.value = !isPencilActive.value

    if (isPencilActive.value) {
      window.meta2d.drawingPencil()
      isPenActive.value = false
      window.meta2d.finishDrawLine()
      window.meta2d.drawLine()
    } else {
      window.meta2d.stopPencil()
    }
  }
  /**
   * 放大镜
   */
  function onToggleMagnifier() {
    isMagnifierActive.value = !isMagnifierActive.value
    isMagnifierActive.value ? window.meta2d.showMagnifier() : window.meta2d.hideMagnifier()
  }
  /**
   * 修改线段开始形状
   */
  function onChangeLineStart(command: string) {
    currentLineFrom.value = command
    window.meta2d.store.data.fromArrow = command

    _updateActivePen({ fromArrow: command }, PenType.Line)
  }
  /**
   * 修改线段结束形状
   */
  function onChangeLineEnd(command: string) {
    currentLineTo.value = command
    window.meta2d.store.data.toArrow = command

    _updateActivePen({ toArrow: command }, PenType.Line)
  }
  /**
   * 修改线类型
   */
  function onChangeLineType(command: string) {
    const [typeName, lineType] = command.split('|')
    lineTypeName.value = typeName
    window.meta2d.store.data.lineType = lineType

    const activeItem: Pen[] = window.meta2d.canvas.store.active
    activeItem.length &&
      activeItem.forEach((pen) => {
        if (pen.type === PenType.Line) {
          window.meta2d.updateLineType(pen, lineType)
        }
      })

    window.meta2d.render()
  }
  /**
   * 修改线宽
   */
  function onChangeLineWidth() {
    window.meta2d.store.data.lineWidth = lineWidth
    _updateActivePen({ lineWidth: lineWidth.value })
  }
  /**
   * 视图缩放
   */
  function onScale(val: number) {
    store.setEditorScale(val)
    window.meta2d && window.meta2d.canvas && window.meta2d.scale(val / 100)
  }
  /**
   * 小地图
   */
  function onToggleMinimap() {
    isMinimapActive.value = !isMinimapActive.value
    isMinimapActive.value ? window.meta2d.showMap() : window.meta2d.hideMap()
  }
  /**
   * 自动锚点
   */
  function onToggleAutoAnchor() {
    window.meta2d.store.options.autoAnchor = !window.meta2d.store.options.autoAnchor
    isAutoAnchor.value = window.meta2d.store.options.autoAnchor
  }
  /**
   * 隐藏/显示锚点
   */
  function onToggleVisibleAnchor() {
    window.meta2d.store.options.alwaysAnchor = !window.meta2d.store.options.alwaysAnchor
    isVisibleAnchor.value = window.meta2d.store.options.alwaysAnchor
  }
  /**
   * 快捷键
   */
  function onHelp() {
    // 优先级低，后续添加
    window.open('https://doc.le5le.com/document/119620214', '_black')
  }

  watch(lineWidth, () => {
    onChangeLineWidth()
  })
</script>

<style lang="scss" scoped>
  .manage-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .file-button {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .input-file {
    position: absolute;
    height: 33px;
    width: 30px;
    top: -20px;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
    font-size: 0;
  }

  .active {
    color: #ff0000;
  }

  .drop-down-menu-wrapper {
    width: 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;

    &.scale-dropdown-menu {
      width: 210px;
    }
  }
</style>
