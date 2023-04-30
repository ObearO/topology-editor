<template>
  <el-form label-width="80px" label-position="left" size="small">
    <div style="padding: 10px 10px 0">
      <el-form-item label="id">
        <span>{{ store.currentPen.id }}</span>
      </el-form-item>
      <el-form-item label="名称">
        <span>{{ store.currentPen.name }}</span>
      </el-form-item>
    </div>
    <el-collapse v-model="activeName">
      <el-collapse-item name="tags" title="数据绑定">
        <div style="padding: 0 10px">
          <div class="tag-input-wrapper">
            <el-select v-model="tags">
              <el-option
                v-for="item in equipmentOptions"
                :key="item.equipmentId"
                :label="item.name"
                :value="item.equipmentId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-item>

      <!--      <el-collapse-item name="data" title="数据绑定">
              <div class="collapse-content">

              </div>
              <div style="padding: 0 10px">
                <el-button type="confirm" style="width: 100%">添加数据</el-button>
              </div>
            </el-collapse-item>-->
    </el-collapse>
  </el-form>
</template>

<script setup lang="ts">
  import { useTopologyEditorStore } from '@/stores/modules/topology-editor'
  const store = useTopologyEditorStore()

  defineOptions({
    name: 'EditorPropsPenData'
  })

  const activeName = ref(['tags', 'data'])
  const equipmentOptions = reactive([
    {
      equipmentId: '1',
      name: 'a设备'
    },
    {
      equipmentId: '2',
      name: 'b设备'
    }
  ])

  const tags = computed({
    get: () => {
      return store.currentPen.tags ? store.currentPen.tags[0] : undefined
    },
    set: (val) => {
      store.currentPen.tags = [val ? val : '']
    }
  })
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
