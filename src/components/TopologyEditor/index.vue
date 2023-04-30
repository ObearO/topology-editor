<template>
  <div class="editor-container">
    <editor-header @save="handleSave" v-if="editable"></editor-header>
    <div class="editor-main" :class="{ 'not-editable': !editable }">
      <editor-icon v-if="editable" class="editor-icon"></editor-icon>
      <editor-canvas :editable="editable" class="editor-canvas"></editor-canvas>
      <editor-props v-if="editable" class="editor-props"></editor-props>
    </div>
  </div>
</template>

<script setup lang="ts">
  import './assets/iconfont.css'
  import EditorProps from './EditorProps/index.vue'
  import EditorCanvas from './EditorCanvas/index.vue'
  import EditorIcon from './EditorIcon/index.vue'
  import EditorHeader from './EditorHeader/index.vue'
  import { LockState } from '@meta2d/core'
  declare const window: any // eslint-disable-line

  defineOptions({ name: 'TopologyEditor' })

  const props = defineProps({
    data: { type: String, require: true },
    editable: { type: Boolean, default: true }
  })

  onMounted(() => {
    initEditor()
  })

  const emit = defineEmits(['save'])

  function initEditor() {
    if (props.data) {
      try {
        const json = JSON.parse(props.data)
        window.meta2d.open(json)
        if (!props.editable) {
          window.meta2d.lock(LockState.DisableEdit)
          window.meta2d.fitView(true, 120)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
  function handleSave() {
    const data = window.meta2d.data()
    /**
     * 设置自定义解析函数
     */
    if (data && window.meta2d.store.data.socketCbJs) {
      data.socketCbJs = window.meta2d.store.data.socketCbJs
    }
    const json = JSON.stringify(data, undefined, 4)
    emit('save', json)
  }

  watch(
    () => props.data,
    () => {
      initEditor()
    }
  )
</script>

<style lang="scss" scoped>
  @import '@/components/TopologyEditor/assets/editor-variable.scss';
  .editor-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: $--editor-background-color;
    border: 1px solid $--editor-border-color;

    .editor-header {
      position: absolute;
      top: 0;
      width: 100%;
      height: 50px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid $--editor-header-border-color;
      box-shadow: 0px 2px 4px $--editor-header-shadow-color;
      z-index: 1000;
    }

    .editor-main {
      height: 100%;
      padding-top: 50px;
      overflow: hidden;
      position: relative;
      display: flex;

      &.not-editable {
        padding-top: 0;
      }

      .editor-icon {
        flex: 0 200px;
        width: 0;
        height: 100%;
        overflow-y: auto;
        border-right: 1px solid $--editor-header-border-color;
        box-shadow: 0px 5px 5px 1px $--editor-header-shadow-color;
        z-index: 100;
      }

      .editor-canvas {
        flex: 1;
        position: relative;
      }

      .editor-props {
        flex: 0 240px;
        width: 0;
        height: 100%;
        overflow-y: auto;
        border-left: 1px solid $--editor-header-border-color;
        box-shadow: 0px 5px 5px 1px $--editor-header-shadow-color;
        z-index: 100;
      }
    }
  }
</style>
