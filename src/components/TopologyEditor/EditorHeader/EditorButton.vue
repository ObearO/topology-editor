<template>
  <div
    class="editor-button"
    :style="{
      flexDirection: vertical ? 'column' : 'row',
      justifyContent: vertical ? 'center' : 'space-between',
      minWidth: vertical ? 'null' : '100px'
    }"
  >
    <slot name="icon"></slot>
    <i v-if="!$slots['icon']" v-show="iconClass" class="btn-icon" :class="`${iconFamily} ${iconClass}`"></i>
    <div class="btn-text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'EditorButton' })
  const props = defineProps({
    iconFamily: { type: String, default: 't-icon' },
    iconClass: { type: String, default: '' },
    vertical: { type: Boolean, default: true }
  })

  const textMarginTop = computed(() => {
    return props.vertical ? '5px' : '0px'
  })
</script>

<style scoped>
  .editor-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    margin-right: 12px;
    padding: 0 3px;
  }

  .editor-button:nth-last-child() {
    margin-right: 0;
  }

  .btn-icon {
    line-height: 1;
  }

  .btn-text {
    margin-top: v-bind(textmargintop);
    font-size: 12px;
    line-height: 1;
  }

  .editor-button:hover {
    color: #409eff;
  }
</style>
