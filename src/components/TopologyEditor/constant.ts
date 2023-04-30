import type { IconGroup } from 'types/editor'

/**
 * pen类型
 */
export enum PenType {
  Node = 0,
  Line = 1,
  All = 2
}

/**
 * 连线类型
 */
export const LineType = {
  曲线: 'curve',
  折线: 'polyline',
  直线: 'line',
  脑图曲线: 'mind'
}

export enum LineTypeIcon {
  '曲线' = 't-curve2',
  '折线' = 't-polyline',
  '直线' = 't-line',
  '脑图曲线' = 't-mind'
}

/**
 * 连线端点样式
 */
export const LineEndsType = [
  '',
  'triangle',
  'diamond',
  'circle',
  'triangleSolid',
  'diamondSolid',
  'circleSolid',
  'lineDown',
  'lineUp',
  'line'
]

/**
 * 编辑器激活状态
 */
export enum EditorActiveType {
  CanvasActive = 0,
  PenActive = 1,
  CombineActive = 2
}

/**
 * ColorPicker preDefine
 */
export const ColorPredefine = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
  '#ffffff00'
]

/**
 * icons工具栏配置文件
 */
export const IconGroups: IconGroup[] = [
  {
    groupName: '基本形状',
    icons: [
      {
        id: 1,
        name: '正方形',
        icon: 't-rect',
        pen: {
          name: 'rectangle',
          text: '正方形',
          width: 100,
          height: 100
        }
      },
      {
        id: 2,
        name: '矩形',
        icon: 't-rectangle',
        pen: {
          name: 'rectangle',
          text: '矩形',
          width: 200,
          height: 50,
          borderRadius: 8
        }
      },
      {
        id: 3,
        name: '圆',
        icon: 't-circle',
        pen: {
          name: 'circle',
          text: '圆',
          width: 100,
          height: 100
        }
      },
      {
        id: 4,
        name: '三角形',
        icon: 't-triangle',
        pen: {
          name: 'triangle',
          text: '三角形',
          width: 100,
          height: 100
        }
      },
      {
        id: 5,
        name: '菱形',
        icon: 't-diamond',
        pen: {
          name: 'diamond',
          text: '菱形',
          width: 100,
          height: 100
        }
      },
      {
        id: 6,
        name: '五边形',
        icon: 't-pentagon',
        pen: {
          name: 'pentagon',
          text: '五边形',
          width: 100,
          height: 100
        }
      },
      {
        id: 7,
        name: '六边形',
        icon: 't-hexagon',
        pen: {
          name: 'hexagon',
          text: '六边形',
          width: 100,
          height: 86.6
        }
      },
      {
        id: 8,
        name: '五角星',
        icon: 't-pentagram',
        pen: {
          name: 'pentagram',
          text: '五角星',
          width: 100,
          height: 100
        }
      },
      {
        id: 9,
        name: '左箭头',
        icon: 't-arrow-left',
        pen: {
          name: 'leftArrow',
          text: '左箭头',
          width: 100,
          height: 40
        }
      },
      {
        id: 10,
        name: '右箭头',
        icon: 't-arrow-right',
        pen: {
          name: 'rightArrow',
          text: '右箭头',
          width: 100,
          height: 40
        }
      },
      {
        id: 11,
        name: '双箭头',
        icon: 't-twoway-arrow',
        pen: {
          name: 'twowayArrow',
          text: '双箭头',
          width: 100,
          height: 40
        }
      },
      {
        id: 12,
        name: '云',
        icon: 't-cloud',
        pen: {
          name: 'cloud',
          text: '云',
          width: 100,
          height: 85
        }
      },
      {
        id: 13,
        name: '消息框',
        icon: 't-msg',
        pen: {
          name: 'message',
          text: '消息框',
          width: 100,
          height: 80
        }
      },
      // {
      //   id: 14,
      //   name: "图片",
      //   icon: "t-image",
      //   pen: {
      //     name: "image",
      //     text: "图片",
      //     width: 100,
      //     height: 100,
      //     image: "/favicon.ico",
      //     imageRatio: true,
      //   },
      // },
      {
        id: 15,
        name: '文本',
        icon: 't-text',
        pen: {
          name: 'text',
          text: '文本',
          width: 100,
          height: 36
        }
      },
      {
        id: 16,
        name: '线',
        icon: 't-line',
        pen: {
          name: 'line',
          text: '线',
          width: 100,
          height: 100,
          lineWidth: 1
        }
      }
    ]
  }
]
