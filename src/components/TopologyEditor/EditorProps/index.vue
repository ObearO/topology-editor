<template>
  <div class="editor-props">
    <editor-props-canvas :key="1" v-show="isShowCanvasProps"></editor-props-canvas>
    <editor-props-pen :key="2" v-show="!isShowCanvasProps"></editor-props-pen>
  </div>
</template>

<script setup lang="ts">
  import { EditorActiveType } from '../constant'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  import EditorPropsCanvas from './EditorPropsCanvas.vue'
  import EditorPropsPen from './EditorPropsPen.vue'
  defineOptions({
    name: 'EditorProps'
  })

  const store = useTopologyEditorStore()
  let isShowCanvasProps = computed(() => store.editorActiveType === EditorActiveType.CanvasActive)
</script>

<style lang="scss" scoped>
  :deep(.el-tabs__item) {
    padding: 0 10px !important;
    text-align: center;
    font-size: 14px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 0px;
  }

  :deep(tabs--top .el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
    padding-left: 0 14px;
  }

  :deep(.el-collapse) {
    border: 0;
  }

  :deep(.el-collapse-item__header) {
    background-color: transparent;
    padding: 0 10px;
  }

  :deep(.el-collapse-item__content) {
    padding: 0px 0 10px;
  }

  :deep(.el-color-picker__trigger) {
    border: 0px;
    width: 26px;
    height: 26px;
  }

  :deep(.el-color-picker__icon) {
    display: none;
  }

  :deep(.el-input-number--small) {
    width: 100px;
  }

  :deep(.el-form-item) {
    .el-input {
      width: 100px;

      .el-input__inner {
        border-width: 0;

        &:hover,
        &:focus,
        &active {
          border-width: 1px;
        }
      }
    }

    .el-input-number--mini {
      width: 100px;
    }
  }
</style>
