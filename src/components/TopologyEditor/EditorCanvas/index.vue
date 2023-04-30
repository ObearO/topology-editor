<template>
  <div class="canvas-wrapper">
    <div id="editor-canvas"></div>
    <editor-context-menu
      v-model:visible="showContextmenu"
      :x="positionX"
      :y="positionY"
      :menu-list="contextmenuList"
      @menuClick="onContextMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { EditorActiveType } from '@/components/TopologyEditor/constant'
  import { LockState, Meta2d, type Pen, type Point } from '@meta2d/core'
  import EditorContextMenu from './EditorContextMenu.vue'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  import type { ContextMenuItem } from 'types/editor'
  const store = useTopologyEditorStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const window: any

  defineOptions({
    name: 'EditorCanvas'
  })

  const props = defineProps({
    editable: {
      type: Boolean,
      default: true
    }
  })

  const showContextmenu = ref(false)
  const positionX = ref(0)
  const positionY = ref(0)
  let contextmenuList = ref<Array<ContextMenuItem>>([])

  onMounted(() => {
    initMeta2d()
    initEventListener()
  })

  function initMeta2d() {
    const options = {
      fontFamily: 'Arial, "Microsoft YaHei"'
    }
    new Meta2d('editor-canvas', options)
    window.meta2d.setBackgroundColor('#f4f4f4')
  }
  function initEventListener() {
    window.addEventListener('resize', onResize, false)

    if (props.editable) {
      window.meta2d.on('scale', (number: number) => {
        store.setEditorScale(Math.round(number * 100))
      })
      window.meta2d.on('add', () => {
        window.meta2d.emit('pensTreeChange')
      })
      window.meta2d.on('update', () => {
        window.meta2d.emit('pensTreeChange')
        const activePens = window.meta2d.canvas.store.active
        if (activePens.length) {
          const rect = window.meta2d.getPenRect(activePens[0])
          activePens.length === 1 &&
            store.setCurrentPenRect({
              x: Math.round(rect.x * 10) / 10,
              y: Math.round(rect.y * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10
            })
        }
        console.log('触发update')
      })
      window.meta2d.on('delete', () => {
        window.meta2d.emit('pensTreeChange')
      })
      window.meta2d.on('contextmenu', onOpenContextMenu)
      document.addEventListener('contextmenu', preventDefault, false)
    }
    window.meta2d.on('active', () => {
      console.log('触发active')
      const activePens = window.meta2d.canvas.store.active
      store.setEditorActiveType(
        activePens.length === 0
          ? EditorActiveType.CanvasActive
          : activePens.length > 1
          ? EditorActiveType.CombineActive
          : EditorActiveType.PenActive
      )
      activePens.length === 1 && store.setCurrentPen(activePens[0])
      activePens.length === 1 && store.setCurrentPenRect(window.meta2d.getPenRect(activePens[0]))
      window.meta2d.emit('pensTreeChange')
    })
    window.meta2d.on('inactive', () => {
      store.setEditorActiveType(EditorActiveType.CanvasActive)
      window.meta2d.emit('pensTreeChange')
    })
    window.meta2d.on('click', onClick)
  }
  function onResize() {
    window.meta2d.resize()
  }
  function onOpenContextMenu(event: { e: MouseEvent }) {
    let { e } = event
    positionX.value = e.clientX
    positionY.value = e.clientY

    const { active: activePens, histories, historyIndex } = window.meta2d.store
    const len = activePens.length
    const hisLen = histories.length

    contextmenuList.value = [
      {
        type: 'menu-item',
        icon: 'el-icon-upload2',
        title: '置顶',
        value: 'top',
        shortcut: '',
        disabled: len === 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-download',
        title: '置底',
        value: 'bottom',
        shortcut: '',
        disabled: len === 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-top',
        title: '上一个图层',
        value: 'up',
        shortcut: '',
        disabled: len === 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-bottom',
        title: '下一个图层',
        value: 'down',
        shortcut: '',
        disabled: len === 0,
        visible: true
      },
      { type: 'split-line' },
      {
        type: 'menu-item',
        icon: 'el-icon-connection',
        title: '组合',
        value: 'combine',
        shortcut: '',
        disabled: len === 0,
        visible: len > 1
      },
      {
        type: 'menu-item',
        icon: 'el-icon-copy-document',
        title: '分解',
        value: 'uncombine',
        shortcut: '',
        disabled: len === 0,
        visible: len === 1 && activePens[0].name === 'combine'
      },
      {
        type: 'menu-item',
        icon: 'el-icon-lock',
        title: '锁定',
        value: 'lock',
        shortcut: '',
        disabled: len === 0,
        visible: len > 0 && !activePens[0].locked
      },
      {
        type: 'menu-item',
        icon: 'el-icon-unlock',
        title: '解锁',
        value: 'unlock',
        shortcut: '',
        disabled: len === 0,
        visible: len > 0 && activePens[0].locked
      },
      { type: 'split-line' },
      {
        type: 'menu-item',
        icon: 'el-icon-delete',
        title: '删除',
        value: 'remove',
        shortcut: 'Del',
        disabled: len === 0,
        visible: true
      },
      { type: 'split-line' },
      {
        type: 'menu-item',
        icon: 'el-icon-delete',
        title: '撤销',
        value: 'undo',
        shortcut: 'Ctrl + Z',
        disabled: hisLen === 0 || historyIndex < 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-delete',
        title: '恢复',
        value: 'redo',
        shortcut: 'Shift + Z',
        disabled: hisLen > 0 && historyIndex === hisLen - 1,
        visible: true
      },
      { type: 'split-line' },
      {
        type: 'menu-item',
        icon: 'el-icon-document-copy',
        title: '复制',
        value: 'copy',
        shortcut: 'Ctrl + C',
        disabled: len === 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-scissors',
        title: '剪切',
        value: 'cut',
        shortcut: 'Ctrl + X',
        disabled: len === 0,
        visible: true
      },
      {
        type: 'menu-item',
        icon: 'el-icon-tickets',
        title: '粘贴',
        value: 'paste',
        shortcut: 'Ctrl + V',
        disabled: false,
        visible: true
      }
    ]

    showContextmenu.value = true
  }

  function onClick(pen: Pen, e: Point) {
    console.log('click', pen, e)
    // 根据自己的需求实现
    showContextmenu.value = false
  }
  function onContextMenuClick(type: string) {
    showContextmenu.value = false
    const activePens = window.meta2d.store.active
    const pen = activePens[0]
    switch (type) {
      case 'top':
        pen && window.meta2d.top(pen)
        break
      case 'bottom':
        pen && window.meta2d.bottom(pen)
        break
      case 'up':
        pen && window.meta2d.up(pen)
        break
      case 'down':
        pen && window.meta2d.down(pen)
        break
      case 'combine':
        window.meta2d.combine(activePens)
        break
      case 'uncombine':
        pen && pen.name === 'combine' && window.meta2d.uncombine(pen)
        break
      case 'lock':
        if (activePens.length > 0) {
          activePens.forEach((pen: { id: string }) => {
            window.meta2d.setValue({ id: pen.id, locked: LockState.DisableEdit }, { render: false, history: true })
          })
          window.meta2d.render()
        }
        break
      case 'unlock':
        if (activePens.length > 0) {
          activePens.forEach((pen: { id: string }) => {
            window.meta2d.setValue({ id: pen.id, locked: LockState.None }, { render: false, history: true })
          })
          window.meta2d.render()
        }
        break
      case 'remove':
        activePens.length > 0 && window.meta2d.delete(activePens)
        break
      case 'undo':
        window.meta2d.undo()
        break
      case 'redo':
        window.meta2d.redo()
        break
      case 'copy':
        window.meta2d.copy()
        break
      case 'cut':
        window.meta2d.cut()
        break
      case 'paste':
        window.meta2d.paste()
        break
      default:
        break
    }
  }
  function preventDefault(e: { preventDefault: () => void }) {
    e.preventDefault()
  }
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('contextmenu', preventDefault)
    window.meta2d.destroy()
  })
</script>

<style lang="scss" scoped>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
  }

  #editor-canvas {
    width: 100%;
    height: 100%;
  }
</style>
