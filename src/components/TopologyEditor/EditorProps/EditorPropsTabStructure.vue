<template>
  <el-tree
    @node-click="onTreeNodeClick"
    highlight-current
    :data="pens as unknown as Pen[]"
    node-key="id"
    :props="{ label: 'name' }"
    default-expand-all
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node" :class="{ 'not-visible': !data.visible }">
        <span>{{ node.label }}</span>
        <span class="tree-node-operation">
          <span @click="onTogglePenVisible(data)">
            <i v-show="data.visible" class="t-icon t-attention"></i>
            <i v-show="!data.visible" class="t-icon t-06"></i>
          </span>
          <span @click="onTogglePenLock(data)">
            <i style="color: red" v-show="data.locked" class="t-icon t-lock"></i>
            <i v-show="!data.locked" class="t-icon t-unlock"></i>
          </span>
        </span>
      </span>
    </template>
  </el-tree>
</template>

<script setup lang="ts">
  import type { Pen } from '@meta2d/core'

  defineOptions({
    name: 'EditorPropsTabStructure'
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const window: any

  onMounted(() => {
    window.meta2d.on('pensTreeChange', onPensChange)
  })

  const pens = ref<Pen>([])

  function onTogglePenVisible(data: { id: string; visible: boolean }) {
    window.meta2d.setValue({ id: data.id, visible: !data.visible }, { history: true })
  }
  function onTogglePenLock(data: { id: string; locked: boolean }) {
    window.meta2d.setValue({ id: data.id, locked: !data.locked }, { history: true })
  }
  function onTreeNodeClick(data: { id: string }) {
    const pen = window.meta2d.findOne(data.id)
    window.meta2d.active([pen])
    window.meta2d.render()
  }
  function onPensChange() {
    const penList: Pen[] = window.meta2d.store.data.pens.map(
      ({ id, parentId, type, name, text, visible = true, locked = 0 }: Pen) => {
        return {
          id,
          parentId,
          type,
          name,
          text,
          visible,
          locked
        } as Pen
      }
    )

    pens.value = handleTree(penList, 'id', 'parentId', 'children')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTree(data: any[], id: string, parentId: string, children: string) {
    let config = {
      id: id || 'id',
      parentId: parentId || 'parentId',
      childrenList: children || 'children'
    }

    const childrenListMap: Map<string, Pen[]> = new Map()
    const nodeIds: Map<string, Pen> = new Map()
    const tree: Pen[] = []

    for (let d of data) {
      let pId = d[config.parentId]
      if (childrenListMap.get(pId) == null) {
        childrenListMap.set(pId, [])
      }
      nodeIds.set(d[config.id], d)
      childrenListMap.get(pId)?.push(d)
    }

    for (let d of data) {
      let parentId = d[config.parentId]
      if (nodeIds.get(parentId) == null) {
        tree.push(d)
      }
    }

    for (let t of tree) {
      adaptToChildrenList(t)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function adaptToChildrenList(o: { [x: string]: any }) {
      if (childrenListMap.get(o[config.id]) !== null) {
        o[config.childrenList] = childrenListMap.get(o[config.id])
      }
      if (o[config.childrenList]) {
        for (let c of o[config.childrenList]) {
          adaptToChildrenList(c)
        }
      }
    }
    return tree
  }

  onUnmounted(() => {
    window.meta2d.off('pensTreeChange', onPensChange)
  })
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    &.not-visible {
      color: #aaa;
    }
  }

  .tree-node-operation {
    width: 60px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
