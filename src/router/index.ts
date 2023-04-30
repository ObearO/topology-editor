import { createRouter, createWebHistory } from 'vue-router'
import Topology from '../views/topology/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Topology',
      component: Topology
    }
  ]
})

export default router
