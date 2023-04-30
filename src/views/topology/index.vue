<script setup lang="ts">
  defineOptions({
    name: 'Topology'
  })

  import TopologyEditor from '@/components/TopologyEditor/index.vue'
  import data from './data.json?raw'
</script>

<template>
  <TopologyEditor :editable="true" :data="data" />
</template>
