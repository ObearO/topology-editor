<!-- eslint-disable vue/valid-v-model -->
<template>
  <el-form label-width="80px" label-position="left">
    <div style="padding: 10px">
      <el-button type="primary" style="width: 100%" @click="addEvent">添加事件</el-button>
    </div>
    <el-collapse v-model="activeName" v-if="penEvents && penEvents.length" :key="key">
      <el-collapse-item v-for="(evt, index) in penEvents" :key="index" :name="`collapse${index}`">
        <template #title>
          <span>{{ `事件${index + 1}` }}</span>
          <i class="collapse-delete-icon t-icon t-shanchu--" @click.stop="deleteEvent(index)"></i>
        </template>

        <div class="collapse-content">
          <el-form-item label="事件类型">
            <el-select v-model="evt['name']" clearable>
              <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="事件行为">
            <el-select v-model="evt['action']" clearable @change="onChangeAction($event, evt)">
              <el-option v-for="item in eventActionOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="链接地址" v-if="evt['action'] === EventAction.Link">
            <el-input v-model="evt['value'] as string" placeholder="url"></el-input>
          </el-form-item>

          <el-form-item label="打开方式" v-if="evt['action'] === EventAction.Link">
            <el-select v-model="evt['params']" clearable>
              <el-option v-for="item in urlOpenOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="目标"
            v-if="evt['action'] === EventAction.Link || evt['action'] === EventAction.SetProps"
          >
            <el-input v-model="evt['params']" placeholder="默认自身"></el-input>
          </el-form-item>

          <template v-if="evt['action'] === EventAction.SetProps">
            <div class="set-props-wrapper">
              <div class="set-props-header">
                <div class="column">Key</div>
                <div class="column">Value</div>
                <div class="icon" @click.stop="addProp(evt)"><i class="el-icon-circle-plus-outline"></i></div>
              </div>
              <div class="set-props-content">
                <div class="row" v-for="(row, idx) in evt.setProps" :key="idx">
                  <el-select class="row-input" v-model="row.key" clearable @change="onPropChange(evt)">
                    <el-option v-for="item in propsOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input @input="onPropChange(evt)" class="row-input" v-model="row.value"></el-input>
                  <div class="icon" @click.stop="deleteProp(evt, idx)"><i class="t-icon t-shanchu--"></i></div>
                </div>
              </div>
            </div>
          </template>

          <template v-if="evt['action'] === EventAction.JS">
            <el-form-item label="函数定义">
              <el-input type="textarea" :rows="5" v-model="evt.value as string"></el-input>
            </el-form-item>
            <el-form-item label="函数参数">
              <el-input v-model="evt.params"></el-input>
            </el-form-item>
          </template>

          <template v-if="evt['action'] === EventAction.GlobalFn">
            <el-form-item label="全局函数名">
              <el-input v-model="evt.value as string"></el-input>
            </el-form-item>
            <el-form-item label="函数参数">
              <el-input v-model="evt.params"></el-input>
            </el-form-item>
          </template>

          <template v-if="evt['action'] === EventAction.Emit">
            <el-form-item label="消息名称">
              <el-input v-model="evt.value as string"></el-input>
            </el-form-item>
            <el-form-item label="消息内容">
              <el-input v-model="evt.params"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="触发条件" v-if="evt.where">
            <el-select v-model="evt.where.type" clearable>
              <el-option v-for="item in whereTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <template v-if="evt.where && evt.where.type === 'comparison'">
            <el-form-item label="属性">
              <el-input v-model="evt.where.key"></el-input>
            </el-form-item>

            <el-form-item label="比较条件">
              <el-select v-model="evt.where.comparison" clearable>
                <el-option v-for="item in comparisonOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="属性值">
              <el-input v-model="evt.where.value as string"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="判断JS" v-if="evt.where && evt.where.type === 'fnJs'">
            <el-form-item>
              <el-input type="textarea" :rows="4" v-model="evt.where.fnJs"></el-input>
            </el-form-item>
          </el-form-item>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script setup lang="ts">
  import type { Option } from 'element-plus/es/components/select-v2/src/select.types'
  import { EventAction, type Event } from '@meta2d/core'
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  const store = useTopologyEditorStore()

  declare interface CustomEvent extends Event {
    setProps: Array<{ key: string | undefined; value: string | undefined }> | null
  }

  defineOptions({
    name: 'EditorPropsPenEvents'
  })

  const key = ref(0)
  const activeName = ref('')
  const eventTypeOptions: Option[] = [
    { value: 'enter', label: '鼠标进入' },
    { value: 'leave', label: '鼠标离开' },
    { value: 'active', label: '选中' },
    { value: 'inactive', label: '取消选中' },
    { value: 'click', label: '单击' },
    { value: 'mousedown', label: '双击' },
    { value: 'mouseup', label: '鼠标按下' },
    { value: 'dblclick', label: '鼠标抬起' },
    { value: 'valueUpdate', label: '值变化' }
  ]
  const eventActionOptions: Option[] = [
    { value: EventAction.Link, label: '打开链接  ' },
    { value: EventAction.SetProps, label: '更改属性' },
    // { value: EventAction.StartAnimate, label: '执行动画' },
    // { value: EventAction.PauseAnimate, label: '暂停动画' },
    // { value: EventAction.StopAnimate, label: '停止动画' },
    { value: EventAction.JS, label: '执行JS代码' },
    { value: EventAction.GlobalFn, label: '执行全局函数' },
    { value: EventAction.Emit, label: '发送消息' }
    // { value: EventAction.StartVideo, label: '播放视频' },
    // { value: EventAction.PauseVideo, label: '暂停视频' },
    // { value: EventAction.StopVideo, label: '停止视频' },
    // { value: EventAction.SendPropData, label: '发送图元数据' }
  ]
  const urlOpenOptions: Option[] = [
    { value: '_blank', label: '新界面打开' },
    { value: '_self', label: '覆盖打开' }
  ]

  const whereTypeOptions: Option[] = [
    { value: '', label: '无' },
    { value: 'comparison', label: '条件判断' },
    { value: 'fnJs', label: '自定义判断' }
  ]
  const comparisonOptions: Option[] = [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
    { value: '>', label: '大于' },
    { value: '>=', label: '大于等于' },
    { value: '<', label: '小于' },
    { value: '<=', label: '小于等于' },
    { value: '[)', label: '介于' },
    { value: '![)', label: '不介于' },
    { value: '[]', label: '属于' },
    { value: '![]', label: '不属于' }
  ]
  const propsOptions: Option[] = [
    { value: 'background', label: '背景颜色' },
    { value: 'color', label: '颜色' },
    { value: 'text', label: '文字' },
    { value: 'width', label: '宽度' },
    { value: 'height', label: '高度' },
    { value: 'visible', label: '显示' },
    { value: 'progress', label: '进度值' },
    { value: 'value', label: '值' }
  ]

  const penEvents = computed({
    get() {
      return (store.currentPen.events as CustomEvent[]) || []
    },
    set(val: CustomEvent[]) {
      store.currentPen.events = val
      console.log(2, store.currentPen)
      key.value++
      console.log(key.value)
    }
  })

  function addEvent() {
    const eventObj = {
      action: '',
      where: {
        type: null,
        value: null,
        key: null,
        comparison: null
      },
      name: '',
      value: null,
      fn: null,
      setProps: null
    }
    const events: CustomEvent[] = store.currentPen.events ? (store.currentPen.events as CustomEvent[]) : []
    events.push(eventObj as unknown as CustomEvent)
    penEvents.value = events
  }
  function deleteEvent(index: number) {
    store.currentPen.events?.splice(index, 1)
  }
  function addProp(evt: CustomEvent) {
    const propObj = { key: undefined, value: undefined }
    evt.setProps?.push(propObj)
  }
  function deleteProp(evt: CustomEvent, idx: number) {
    evt?.setProps?.splice(idx, 1)
  }
  function onChangeAction(event: EventAction, evt: CustomEvent) {
    evt.params = undefined
    evt.value = null
    evt.setProps = event === EventAction.SetProps ? [{ key: undefined, value: undefined }] : null
  }
  function onPropChange(evt: CustomEvent) {
    const valueObj: Record<string, string> = {}
    evt.setProps?.forEach((prop) => {
      valueObj[prop.key as string] = prop.value as string
    })
    evt.value = valueObj
  }
</script>

<style lang="scss" scoped>
  .collapse-delete-icon {
    position: absolute;
    right: 35px;
    padding: 5px;

    &:hover {
      color: #409eff;
    }
  }

  .set-props-wrapper {
    margin-bottom: 18px;

    .set-props-header {
      height: 36px;
      font-size: 12px;
      line-height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;

      .column {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #afafaf;
      }

      .icon {
        flex: 0 30px;
        width: 0;
        font-size: 14px;
        color: #fff;
        text-align: center;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }

    .set-props-content {
      .row {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2px;

        .row-input {
          flex: 1;

          :deep(.el-input__inner) {
            border: 0;
          }

          & + .row-input {
            margin-left: 2px;
          }
        }

        .icon {
          flex: 0 30px;
          width: 0;
          font-size: 14px;
          color: #fff;
          text-align: center;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
</style>
