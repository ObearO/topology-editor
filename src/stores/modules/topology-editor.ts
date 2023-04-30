import { defineStore } from 'pinia'
import { store } from '@/stores'
import type { Icon } from 'types/editor'
import { EditorActiveType } from '@/components/TopologyEditor/constant'
import type { Pen, Rect } from '@meta2d/core'

export const useTopologyEditorStore = defineStore('topology-editor', {
  state: () => ({
    editorScale: 100,
    oftenIcons: [] as Icon[],
    editorActiveType: EditorActiveType.CanvasActive,
    currentPen: {} as Pen,
    currentPenRect: {} as Rect
  }),
  actions: {
    setEditorScale(value: number) {
      this.editorScale = value
    },
    setEditorActiveType(type: EditorActiveType) {
      this.editorActiveType = type
    },
    setCurrentPen(value: Pen) {
      this.currentPen = value
    },
    setCurrentPenRect(value: Rect) {
      this.currentPenRect = value
    },
    addOftenIcon(icon: Icon) {
      const iconArr = this.oftenIcons
      const index = iconArr.findIndex((item) => {
        return item.name === icon.name
      })
      if (index > -1) {
        iconArr.splice(index, 1)
      }
      const newLength = iconArr.unshift(icon)
      if (newLength > 8) {
        iconArr.splice(8, 1)
      }
    }
  }
})

export const useTopologyEditorStoreOutside = () => useTopologyEditorStore(store)
