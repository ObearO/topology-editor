<template>
  <div class="contextmenu" v-show="flag" :style="style" ref="contextmenu">
    <div class="contextmenu-list" @click.stop="handleClick">
      <template v-for="(item, index) of menuList">
        <div
          v-if="item.type === 'menu-item'"
          :key="item.value"
          :class="{ disabled: item.disabled }"
          :style="{ display: item.visible ? 'flex' : 'none' }"
          :data-value="item.value"
          class="contextmenu-item"
        >
          <i v-if="item.icon" :class="`${item.icon}`" />
          <div class="contextmenu-item-title">
            {{ item.title }}
          </div>
          <span class="shortcut-key">{{ item.shortcut }}</span>
        </div>
        <div v-if="item.type === 'split-line'" :key="index" class="split-line"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ContextMenuItem } from 'types/editor'

  defineOptions({
    name: 'EditorContextMenu'
  })

  const props = defineProps({
    visible: { type: Boolean, default: false },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    menuList: { type: Array<ContextMenuItem>, default: () => [] }
  })

  const emit = defineEmits(['update:visible', 'menuClick'])

  const contextmenu = ref<HTMLInputElement | null>(null)

  const flag = computed({
    get: () => {
      if (props.visible) {
        window.addEventListener('mousedown', watchContextmenu)
      }
      return props.visible
    },
    set: (newVal) => {
      emit('update:visible', newVal)
    }
  })

  const style = computed(() => {
    return {
      left: props.x + 'px',
      top: props.y + 'px',
      display: props.visible ? 'block' : 'none'
    }
  })

  function watchContextmenu(event: MouseEvent) {
    if ((contextmenu.value && !contextmenu.value.contains(event.target as Node)) || event.button !== 0) {
      flag.value = false
    }
    window.removeEventListener('mousedown', watchContextmenu)
  }
  function handleClick(event: MouseEvent) {
    let el = event.target as HTMLElement
    while (!el.dataset.value) {
      el = el.parentNode as HTMLElement
    }
    const menu = props.menuList.find((m) => {
      return m.value === el.dataset.value
    })
    if (menu && menu.disabled) return
    emit('menuClick', el.dataset.value)
  }

  onMounted(() => {
    console.log(props.menuList)
    document.querySelector('body')?.appendChild(contextmenu.value as Node)
  })
</script>

<style lang="scss" scoped>
  @import '@/components/TopologyEditor/assets/editor-variable.scss';

  .contextmenu {
    position: absolute;
    padding: 5px 0;
    z-index: 3018;
    background: $--contextmenu-background-color;
    border: $--contextmenu-border;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .contextmenu-list {
      .contextmenu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 20px 8px 15px;
        margin: 0;
        font-size: $--contextmenu-font-size;
        color: $--contextmenu-font-color;
        cursor: pointer;
        min-width: 200px;
        user-select: none;

        &:hover {
          background: $--contextmenu-item-hover-background-color;
          color: $--contextmenu-hover-font-color;
        }

        &.disabled {
          background: $--contextmenu-item-disable-background-color;
          color: $--contextmenu-disable-font-color;
          cursor: not-allowed;
        }

        .t-icon {
          font-size: 12px;
        }

        .contextmenu-item-title {
          flex: 1;
          margin-left: 10px;
        }

        .shortcut-key {
          flex: 0 50px;
          text-align: right;
        }
      }
      .split-line {
        height: 0px;
        width: 100%;
        border-top: $--contextmenu-border;
      }
    }
  }
</style>
