<!-- eslint-disable vue/valid-v-model -->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="外观" name="props">
        <el-form label-width="100px" label-position="left">
          <el-collapse v-model="activeCollapse">
            <el-collapse-item v-show="!isLine" name="position&size" title="位置和大小">
              <div class="collapse-content">
                <el-form-item v-for="meta in xyhwFormMeta" :key="meta.key" :label="meta.label">
                  <el-input
                    v-if="meta.type === 'input'"
                    v-model="(store.currentPenRect[meta.key as keyof Rect] as number)"
                    @input="handleChangePenRect"
                  ></el-input>
                </el-form-item>

                <el-form-item label="锁定宽高比">
                  <el-switch v-model="(store.currentPen as CustomPen).radio"></el-switch>
                </el-form-item>

                <el-form-item v-for="meta in positionFormMeta" :key="meta.key" :label="meta.label">
                  <el-input
                    v-if="meta.type === 'input'"
                    v-model="store.currentPen[meta.key] as any"
                    @input="handleChangePen(meta.key)"
                  ></el-input>
                  <el-color-picker
                    v-if="meta.type === 'color-picker'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-color-picker>
                  <el-switch
                    v-if="meta.type === 'switch'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="style" title="样式">
              <div class="collapse-content">
                <el-form-item v-show="isLine" label="起点箭头">
                  <el-dropdown
                    v-model="store.currentPen.fromArrow"
                    placement="bottom-start"
                    @command="onChangeLineStart"
                  >
                    <editor-button :vertical="false" :iconClass="`t-from-${currentLineFrom}`"></editor-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in LineEndsType" :key="index" :command="item">
                          <i style="font-size: 30px" :class="`t-icon t-from-${item}`"></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-form-item>
                <el-form-item v-show="isLine" label="起点箭头大小">
                  <el-input-number
                    controls-position="right"
                    v-model="store.currentPen['fromArrowSize']"
                    :max="100"
                    :min="1"
                    :step="1"
                    @input="handleChangePen('fromArrowSize')"
                  ></el-input-number>
                </el-form-item>
                <el-form-item v-show="isLine" label="起点箭头颜色">
                  <el-color-picker
                    v-model="store.currentPen['fromArrowColor']"
                    @change="handleChangePen('fromArrowColor')"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item v-show="isLine" label="终点箭头">
                  <el-dropdown v-model="store.currentPen.toArrow" placement="bottom-start" @command="onChangeLineEnd">
                    <editor-button :iconClass="`t-to-${currentLineTo}`"></editor-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="(item, index) in LineEndsType" :key="index" :command="item">
                          <i style="font-size: 30px" :class="`t-icon t-to-${item}`"></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-form-item>
                <el-form-item v-show="isLine" label="终点箭头大小">
                  <el-input-number
                    controls-position="right"
                    v-model="store.currentPen['toArrowSize']"
                    :max="100"
                    :min="1"
                    :step="1"
                    @input="handleChangePen('toArrowSize')"
                  ></el-input-number>
                </el-form-item>
                <el-form-item v-show="isLine" label="终点箭头颜色">
                  <el-color-picker
                    v-model="store.currentPen['toArrowColor']"
                    @change="handleChangePen('toArrowColor')"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item v-show="isLine" label="线条类型">
                  <el-dropdown
                    v-model="(store.currentPen as CustomPen).lineType"
                    placement="bottom-start"
                    @command="onChangeLineType"
                  >
                    <editor-button :vertical="false" :iconClass="LineTypeIcon[lineTypeName as keyof typeof LineType]">
                      {{ lineTypeName }}
                    </editor-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          style="display: flex; justify-content: space-between"
                          v-for="(item, index) in Object.keys(LineType)"
                          :key="index"
                          :command="`${item}|${LineType[item as keyof typeof LineType]}`"
                        >
                          <span style="margin-right: 10px">{{ item }}</span>
                          <i :class="`t-icon ${LineTypeIcon[item as keyof typeof LineType]}`"></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-form-item>

                <el-form-item label="线条样式">
                  <el-select
                    ref="lineTypeSelect"
                    v-model="(store.currentPen  as CustomPen).customLineDash"
                    @change="handleChangePenLineType"
                    placeholder=""
                  >
                    <el-option
                      v-for="strokeType in lineStrokeOptions"
                      :key="strokeType.value"
                      :label="' '"
                      :value="strokeType.value"
                    >
                      <img width="75" :src="strokeType.svg" alt="" />
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  v-for="meta in styleFormMeta"
                  v-show="meta.condition === 'line' ? isLine : true"
                  :key="meta.key"
                  :label="meta.label"
                >
                  <el-input
                    v-if="meta.type === 'input'"
                    v-model="store.currentPen[meta.key] as any"
                    @input="handleChangePen(meta.key)"
                    :placeholder="meta.placeholder"
                  ></el-input>
                  <el-input-number
                    v-if="meta.type === 'input-number'"
                    controls-position="right"
                    v-model="store.currentPen[meta.key] as any"
                    :max="meta.max"
                    :min="meta.min"
                    :step="meta.step"
                    :step-strictly="meta.stepStrictly"
                    :placeholder="meta.placeholder"
                    @input="handleChangePen(meta.key)"
                  ></el-input-number>
                  <el-select
                    v-if="meta.type === 'select'"
                    v-model="store.currentPen[meta.key]"
                    @change="handleChangePen(meta.key)"
                    :placeholder="meta.placeholder"
                  >
                    <el-option v-for="item in meta.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-color-picker
                    v-if="meta.type === 'color-picker'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-color-picker>
                  <el-switch
                    v-if="meta.type === 'switch'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-collapse-item>
            <el-collapse-item name="text" title="文字">
              <div class="collapse-content">
                <el-form-item v-for="meta in textFormMeta" :key="meta.key" :label="meta.label">
                  <el-input
                    v-if="meta.type === 'input'"
                    v-model="store.currentPen[meta.key] as any"
                    @input="handleChangePen(meta.key)"
                    :placeholder="meta.placeholder"
                  ></el-input>
                  <el-input-number
                    v-if="meta.type === 'input-number'"
                    controls-position="right"
                    v-model="store.currentPen[meta.key] as any"
                    :max="meta.max"
                    :min="meta.min"
                    :step="meta.step"
                    :step-strictly="meta.stepStrictly"
                    :placeholder="meta.placeholder"
                    @input="handleChangePen(meta.key)"
                  ></el-input-number>
                  <el-color-picker
                    v-if="meta.type === 'color-picker'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-color-picker>
                  <el-select
                    v-if="meta.type === 'select'"
                    v-model="store.currentPen[meta.key]"
                    @change="handleChangePen(meta.key)"
                    clearable
                    :placeholder="meta.placeholder"
                  >
                    <el-option v-for="item in meta.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-switch
                    v-if="meta.type === 'switch'"
                    v-model="store.currentPen[meta.key] as any"
                    @change="handleChangePen(meta.key)"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="事件" name="event">
        <editor-props-pen-events />
      </el-tab-pane>
      <el-tab-pane label="数据" name="data">
        <editor-props-pen-data />
      </el-tab-pane>
      <el-tab-pane label="结构" name="structure">
        <editor-props-tab-structure />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import EditorPropsTabStructure from '@/components/TopologyEditor/EditorProps/EditorPropsTabStructure.vue'
  import EditorPropsPenEvents from '@/components/TopologyEditor/EditorProps/EditorPropsPenEvents.vue'
  import EditorPropsPenData from '@/components/TopologyEditor/EditorProps/EditorPropsPenData.vue'
  import type { Pen, Rect } from '@meta2d/core'
  import { LineEndsType, LineType, LineTypeIcon, PenType } from '@/components/TopologyEditor/constant'
  import EditorButton from '@/components/TopologyEditor/EditorHeader/EditorButton.vue'
  import type { FormMetaItem } from 'types/editor'
  import type { Option } from 'element-plus/es/components/select-v2/src/select.types'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  const store = useTopologyEditorStore()

  const lineSolid = new URL('../assets/svg/line-solid.svg', import.meta.url).href
  const lineDashedSmall = new URL('../assets/svg/line-dashed-small.svg', import.meta.url).href
  const lineDashedLarge = new URL('../assets/svg/line-dashed-large.svg', import.meta.url).href
  const lineDashedDot = new URL('../assets/svg/line-dashed-dot.svg', import.meta.url).href

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const window: any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  declare interface CustomPen extends Pen {
    lineType: string
    customLineDash: string
    radio: boolean
  }

  defineOptions({
    name: 'EditorPropsPen'
  })
  const activeName = ref('props')
  const activeCollapse = reactive(['position&size', 'style', 'text', 'line-position'])
  const xyhwFormMeta = reactive<FormMetaItem[]>([
    { type: 'input', label: '坐标X', key: 'x' },
    { type: 'input', label: '坐标Y', key: 'y' },
    { type: 'input', label: '宽度', key: 'width' },
    { type: 'input', label: '高度', key: 'height' }
  ])
  const positionFormMeta = reactive<FormMetaItem[]>([
    { type: 'input', label: '圆角', key: 'borderRadius' },
    { type: 'input', label: '旋转', key: 'rotate' },
    { type: 'input', label: '内边距', key: 'paddingLeft' },
    { type: 'input', label: '内边距', key: 'paddingRight' },
    { type: 'input', label: '内边距', key: 'paddingTop' },
    { type: 'input', label: '内边距', key: 'paddingBottom' },
    { type: 'input', label: '进度', key: 'progress' },
    { type: 'color-picker', label: '进度颜色', key: 'progressColor' },
    { type: 'switch', label: '垂直进度', key: 'verticalProgress' },
    { type: 'switch', label: '水平翻转', key: 'flipX' },
    { type: 'switch', label: '垂直翻转', key: 'flipY' },
    { type: 'switch', label: '输入框', key: 'input' }
  ])
  const styleFormMeta = reactive<FormMetaItem[]>([
    {
      type: 'select',
      label: '线末端样式',
      key: 'lineCap',
      options: [
        { value: 'round', label: '默认' },
        { value: 'butt', label: '平直' },
        {
          value: 'square',
          label: '正方形'
        }
      ]
    },
    {
      type: 'select',
      label: '线转折点样式',
      key: 'lineJoin',
      options: [
        { value: 'round', label: '默认' },
        { value: 'bevel', label: '斜角' },
        {
          value: 'miter',
          label: '尖角'
        }
      ]
    },
    { type: 'color-picker', label: '颜色', key: 'color' },
    { type: 'color-picker', label: '浮动颜色', key: 'hoverColor' },
    { type: 'color-picker', label: '选中颜色', key: 'activeColor' },
    { type: 'input-number', label: '线条宽度', key: 'lineWidth', min: 0 },
    { type: 'color-picker', label: '背景颜色', key: 'background' },
    { type: 'color-picker', label: '浮动背景颜色', key: 'hoverBackground' },
    { type: 'color-picker', label: '选中背景颜色', key: 'activeBackground' },
    {
      type: 'input-number',
      label: '透明度',
      key: 'globalAlpha',
      min: 0,
      max: 1,
      step: 0.1,
      stepStrictly: true,
      placeholder: '0 - 1'
    },
    { type: 'color-picker', label: '锚点颜色', key: 'anchorColor' },
    { type: 'input', label: '锚点半径', key: 'anchorRadius', placeholder: '0 - 1' },
    { type: 'color-picker', label: '阴影颜色', key: 'shadowColor' },
    { type: 'input-number', label: '阴影模糊度', key: 'shadowBlur', min: 0 },
    { type: 'input-number', label: '阴影X偏移', key: 'shadowOffsetX' },
    { type: 'input-number', label: '阴影Y偏移', key: 'shadowOffsetY' }
  ])
  const textFormMeta = reactive<FormMetaItem[]>([
    { type: 'input', label: '字体名', key: 'fontFamily' },
    { type: 'input-number', label: '字体大小', key: 'fontSize', min: 0, max: 100, step: 1 },
    { type: 'color-picker', label: '文字颜色', key: 'textColor' },
    { type: 'color-picker', label: '浮动文字颜色', key: 'hoverTextColor' },
    { type: 'color-picker', label: '选中文字颜色', key: 'activeTextColor' },
    { type: 'color-picker', label: '文字背景', key: 'textBackground' },
    {
      type: 'select',
      label: '倾斜',
      key: 'fontStyle',
      options: [
        { value: 'normal', label: '正常' },
        { value: 'italic', label: '倾斜' }
      ]
    },
    {
      type: 'select',
      label: '加粗',
      key: 'fontWeight',
      options: [
        { value: '300', label: '正常' },
        { value: '700', label: '加粗' }
      ]
    },
    {
      type: 'select',
      label: '水平对齐',
      key: 'textAlign',
      options: [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '水平居中' },
        {
          value: 'right',
          label: '右对齐'
        }
      ]
    },
    {
      type: 'select',
      label: '垂直对齐',
      key: 'textBaseline',
      options: [
        { value: 'top', label: '上对齐' },
        { value: 'middle', label: '垂直居中' },
        {
          value: 'bottom',
          label: '下对齐'
        }
      ]
    },
    { type: 'input-number', label: '行高', key: 'lineHeight', min: 0 },
    {
      type: 'select',
      label: '换行',
      key: 'whiteSpace',
      options: [
        { value: 'nowrap', label: '不换行' },
        {
          value: 'pre-line',
          label: '换行符换行'
        },
        { value: 'break-all', label: '永远换行' }
      ]
    },
    { type: 'input-number', label: '文字宽度', key: 'textWidth', min: 0 },
    { type: 'input-number', label: '文字高度', key: 'textHeight', min: 0 },
    { type: 'input-number', label: '水平偏移', key: 'textLeft' },
    { type: 'input-number', label: '垂直偏移', key: 'textTop' },
    {
      type: 'select',
      label: '超出省略',
      key: 'ellipsis',
      options: [
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      placeholder: '是'
    },
    { type: 'switch', label: '隐藏文字', key: 'hiddenText' },
    { type: 'input-number', label: '保留小数位数', key: 'keepDecimal', min: 0, step: 1, stepStrictly: true },
    { type: 'input', label: '文本', key: 'text' }
  ])
  const lineStrokeOptions: Option[] = [
    { value: '5, 0', label: '实线', svg: lineSolid },
    { value: '5, 5', label: '虚线1', svg: lineDashedSmall },
    { value: '10, 10', label: '虚线2', svg: lineDashedLarge },
    { value: '10, 10, 2, 10', label: '虚线3', svg: lineDashedDot }
  ]

  const lineTypeName = ref('曲线')
  const currentLineFrom = ref('')
  const currentLineTo = ref('')

  const isLine = computed(() => {
    return store.currentPen.type === PenType.Line
  })

  function handleChangePen(propKey: keyof Pen) {
    const propValue = store.currentPen[propKey]
    console.log('set ' + propKey + ' : ' + propValue)
    window.meta2d &&
      window.meta2d.canvas &&
      window.meta2d.setValue(
        {
          id: store.currentPen.id,
          [propKey]: propValue
        },
        { history: true }
      )
    window.meta2d && window.meta2d.canvas && window.meta2d.render()
  }
  function handleChangePenRect() {
    console.log('set penRect', store.currentPenRect)
    const pen = window.meta2d.findOne(store.currentPen.id)
    window.meta2d && window.meta2d.setPenRect(pen, store.currentPenRect)
  }

  const lineTypeSelect = ref<ComponentPublicInstance | null>(null)

  function handleChangePenLineType(val: string) {
    console.log('set pen lineType', val)
    const strokeType = lineStrokeOptions.find((option) => {
      return option.value === val
    })
    lineTypeSelect.value?.$el.children[0].children[0].setAttribute(
      'style',
      `background: url(${strokeType?.svg}) no-repeat;
            background-size: 80%;
            background-position: center;
          `
    )
    window.meta2d && window.meta2d.setValue({ id: store.currentPen.id, lineDash: val.split(',') }, { history: true })
  }
  /**
   * 修改线段类型
   * @param command
   */
  function onChangeLineType(command: string) {
    console.log(store.currentPen)
    const [typeName, lineType] = command.split('|')
    lineTypeName.value = typeName
    const activeItem = window.meta2d.canvas.store.active
    window.meta2d && window.meta2d.updateLineType(activeItem[0], lineType)
  }
  /**
   * 修改线段开始形状
   */
  function onChangeLineStart(command: string) {
    currentLineFrom.value = command
    window.meta2d && window.meta2d.setValue({ id: store.currentPen.id, fromArrow: command }, { history: true })
  }
  /**
   * 修改线段结束形状
   */
  function onChangeLineEnd(command: string) {
    currentLineTo.value = command
    window.meta2d && window.meta2d.setValue({ id: store.currentPen.id, toArrow: command }, { history: true })
  }
</script>
