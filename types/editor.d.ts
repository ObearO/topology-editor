import type { Rect } from '@meta2d/core'
import type { Pen } from '@meta2d/core/src/pen/model'
import type { Option } from 'element-plus/es/components/select-v2/src/select.types'

declare type Icon = {
  id: string | number
  name: string
  icon: string
  pen: Pen
}

declare type IconGroup = {
  groupName: string
  icons: Icon[]
}

declare type ContextMenuItem = {
  type: string
  icon?: string
  title?: string
  value?: string
  shortcut?: string
  disabled?: boolean
  visible?: boolean
}

declare type FormMetaItem = {
  type: string
  label: string
  key: keyof Rect | keyof Pen
  options?: OptionOptionOption
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  placeholder?: string
  condition?: string
}
