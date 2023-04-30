<template>
  <div class="editor-icon">
    <el-collapse v-model="activeCollapse" @change="onCollapse">
      <el-collapse-item name="common" v-if="oftenIcons">
        <template #title>
          <div class="collapse-title">
            <i v-show="!isFolderOpened('common')" class="el-icon-folder"></i>
            <i v-show="isFolderOpened('common')" class="el-icon-folder-opened"></i>
            {{ `常用图形(${oftenIcons.length})` }}
          </div>
        </template>
        <div class="collapse-content" @dragstart="onDragstart($event, oftenIcons)">
          <div v-show="oftenIcons.length < 1" class="empty">
            <span>暂无常用图标</span>
          </div>
          <div class="icon" v-for="(icon, index) in oftenIcons" :key="index" :data-index="index" draggable="true">
            <i :class="`t-icon ${icon.icon}`" :title="icon.name"></i>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item v-for="(group, index) in icons" :key="index" :name="group.groupName">
        <template #title>
          <div class="collapse-title">
            <i v-show="!isFolderOpened(group.groupName)" class="el-icon-folder"></i>
            <i v-show="isFolderOpened(group.groupName)" class="el-icon-folder-opened"></i>
            {{ `${group.groupName}(${group.icons.length})` }}
          </div>
        </template>

        <div class="collapse-content" @dragstart="onDragstart($event, group.icons)">
          <div class="icon" v-for="(icon, index) in group.icons" :key="index" draggable="true" :data-index="index">
            <i :class="`t-icon ${icon.icon}`" :title="icon.name"></i>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
  import { IconGroups } from '../constant'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  import type { CollapseActiveName, CollapseModelValue } from 'element-plus'

  defineOptions({
    name: 'EditorProps'
  })

  const store = useTopologyEditorStore()

  const icons = reactive(IconGroups)
  let activeCollapse: CollapseActiveName[] = ['基本形状']
  const oftenIcons = store.oftenIcons

  function isFolderOpened(name: CollapseActiveName) {
    return activeCollapse.includes(name)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragstart(e: DragEvent, icons: any[]) {
    const index = e.target && e.target instanceof HTMLElement ? Number(e.target.dataset['index']) : -1
    if (index > -1) {
      const icon = icons[index]
      e.dataTransfer?.setData('Text', JSON.stringify(icon.pen))
      store.addOftenIcon(icon)
    }
  }
  function onCollapse(activeNames: CollapseModelValue) {
    activeCollapse = activeNames as CollapseActiveName[]
  }
</script>

<style lang="scss" scoped>
  @import '@/components/TopologyEditor/assets/editor-variable.scss';
  .empty {
    width: 100%;
    font-size: 12px;
    color: #afafaf;
    text-align: center;
  }
  .collapse-title {
    padding: 0 0 0 10px;
  }
  .collapse-content {
    padding: 0 19px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: auto;
  }
  .icon {
    flex: 0 40px;
    width: 0;
    text-align: center;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: $--editor-text-color;
  }
  .icon:hover {
    background-color: $--editor-icon-hover-color;
  }
  .icon > i {
    font-size: 24px;
  }

  :deep(.el-collapse-item__content) {
    padding: 0px 0 10px;
  }
</style>
