<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <el-row>
        <el-col>
          <span style="font-weight: bold; font-size: 18px; vertical-align: middle">
            {{ $t(`container.container.title`) }}
          </span>
          <!--          <el-select-->
          <!--            v-model="cloudStore.defaultOption"-->
          <!--            placeholder="选择地域"-->
          <!--            style="width: 105px; margin-left: 15px"-->
          <!--            size="small"-->
          <!--            clearable-->
          <!--          >-->
          <!--            <template #prefix>-->
          <!--              <pixiu-icon size="12px" name="icon-diyufenbu" type="iconfont"></pixiu-icon>-->
          <!--            </template>-->
          <!--            <el-option-->
          <!--              v-for="item in cloudStore.options"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->

          <span
            style="
              font-size: 12px;
              float: right;
              color: rgba(0, 0, 0, 0.9);
              vertical-align: middle;
              margin-left: 5px;
              margin-top: 8px;
            "
          >
            管理指南
            <el-icon style="vertical-align: middle; margin-right: 10px">
              <component :is="'Edit'" />
            </el-icon>
          </span>
        </el-col>
      </el-row>
    </el-card>

    <div style="margin-top: 20px"></div>

    <Description
      :description="'Pixiu容器服务支持自建 Kubernetes 集群，也支持导入其他云厂商的集群进行统一管理。'"
    />

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'user:cloud:add'"
            class="pixiu-button"
            type="primary"
            style="margin-left: 1px"
            @click="cloudStore.createCloud"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            新建集群
          </el-button>

          <!-- <div style="margin-left: 8px; float: right; margin-top: 6px">
            <pixiu-icon
              name="icon-icon-refresh"
              style="cursor: pointer"
              size="14px"
              type="iconfont"
              color="#909399"
              @click="cloudStore.getCloudList"
            />
          </div> -->

          <!-- <div style="margin-left: 8px; float: right; margin-left: 12px">
            <button class="pixiu-two-button" @click="cloudStore.getCloudList">搜索</button>
          </div> -->

          <el-input
            v-model="cloudStore.pageInfo.query"
            placeholder="多个过滤标签用回车分隔"
            style="width: 560px; float: right"
            clearable
            @input="cloudStore.getCloudList"
            @clear="cloudStore.getCloudList"
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="cloudStore.getCloudList"
              />

              <!-- <el-icon class="el-input__icon" @click="cloudStore.getCloudList">
                <component :is="'Search'" />
              </el-icon> -->
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="cloudStore.loading"
          :data="cloudStore.cloudList"
          stripe
          style="margin-top: 2px; width: 100%"
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="30" /> -->

          <el-table-column prop="name" sortable label="集群名称">
            <template #default="scope">
              <el-link
                :style="`color: ${
                  scope.row.status === 0 ? '#006eff' : '#7b7b7b'
                }; font-size: 12px; margin-right: 2px`"
                type="primary"
                :underline="false"
                :disabled="!(scope.row.status === 0)"
                @click="jumpRoute(scope.row)"
              >
                {{ scope.row.alias_name }}
              </el-link>
              <el-tooltip content="修改名称">
                <pixiu-icon
                  name="icon-bianji"
                  style="cursor: pointer"
                  size="12px"
                  type="iconfont"
                  color="#909399"
                  @click="cloudStore.editAlias(scope.row)"
                />
              </el-tooltip>
              <div>
                <span style="color: #5e5e63; font-size: 12px; margin-right: 2px" type="primary">
                  {{ scope.row.name }}
                </span>
                <el-tooltip content="复制">
                  <pixiu-icon
                    name="icon-copy"
                    style="cursor: pointer"
                    size="12px"
                    type="iconfont"
                    color="#909399"
                    @click="copy(scope.row.name)"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="状态">
            <template #default="scope">
              <div class="pixiu-table-formatter">
                <el-space>
                  <el-popover
                    placement="top-start"
                    :width="200"
                    trigger="hover"
                    @show="cloudStore.showStatusInfo(scope.row)"
                    @hide="cloudStore.hideStatusInfo()"
                  >
                    <template #reference>
                      <el-icon v-if="scope.row.status === 1" class="is-loading" color="#409efc"
                        ><RefreshRight
                      /></el-icon>
                      <el-icon v-else-if="scope.row.status === 0" color="#529b2e"
                        ><SuccessFilled
                      /></el-icon>
                      <el-icon v-else-if="scope.row.status === 3" color="#c45656"
                        ><CircleCloseFilled
                      /></el-icon>
                      <el-icon v-else color="#006eff"><InfoFilled /></el-icon>
                    </template>
                    <template #default>
                      <div v-if="scope.row.status === 0">运行中...</div>
                      <div v-else-if="scope.row.status === 1">
                        <el-table
                          :data="cloudStore.statusData"
                          stripe
                          header-row-class-name="pixiu-table-header"
                          :cell-style="{
                            'font-size': '12px',
                            color: '#191919',
                          }"
                        >
                          <el-table-column prop="name" label="名称" sortable />

                          <el-table-column prop="status" label="状态">
                            <template #default="scope1">
                              <div
                                style="font-size: 12px; color: #29292b"
                                type="primary"
                                :underline="false"
                              >
                                <el-icon
                                  v-if="scope1.row.status === '运行中'"
                                  class="is-loading"
                                  color="#409efc"
                                  ><RefreshRight
                                /></el-icon>
                                <el-icon v-else-if="scope1.row.status === '已成功'" color="#529b2e"
                                  ><SuccessFilled
                                /></el-icon>
                                <el-icon
                                  v-else-if="scope1.row.status === '部署失败'"
                                  color="#c45656"
                                  ><CircleCloseFilled
                                /></el-icon>
                                <el-icon v-else color="#909399"><InfoFilled /></el-icon>
                                {{ scope1.row.status }}
                              </div>
                            </template>
                          </el-table-column>

                          <template #empty>
                            <div class="table-inline-word">暂无部署任务</div>
                          </template>
                        </el-table>
                      </div>
                      <div v-else-if="scope.row.status === 3">部署失败</div>
                      <div v-else>未启动部署</div>
                    </template>
                  </el-popover>

                  <div
                    :class="`${
                      scope.row.status === 0
                        ? 'color-green-word'
                        : scope.row.status === 1
                        ? 'color-yellow-word'
                        : scope.row.status === 3
                        ? 'color-red-word'
                        : 'color-blue-word'
                    }`"
                  >
                    {{ statusText[scope.row.status] }}
                  </div>
                </el-space>
              </div>
            </template>
          </el-table-column>

          <el-table-column :formatter="cloudTypeFormatter" prop="cluster_type" label="集群类型" />
          <el-table-column prop="kubernetes_version" :formatter="cloudVersionFormatter">
            <template #header>
              <Icon icon="QuestionFilled" desc="原生 kubernetes 的版本"> kubernetes版本 </Icon>
            </template>
          </el-table-column>
          <el-table-column prop="nodes" label="节点数" :formatter="formatterClusterNode" />

          <el-table-column>
            <template #header>
              <Icon icon="QuestionFilled" desc="启用集群删除保护时，集群不能被删除。">
                保护状态
              </Icon>
            </template>
            <template #default="scope">
              <el-switch
                v-model="scope.row.protected"
                inline-prompt
                size="small"
                @change="changeProtectStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" prop="gmt_create" sortable :formatter="formatterTime">
          </el-table-column>

          <!-- <el-table-column prop="resources" label="资源量" :formatter="formatterResource" /> -->

          <el-table-column fixed="right" label="操作" width="150px">
            <template #default="scope">
              <el-button
                v-permissions="'user:cloud:setting'"
                size="small"
                type="text"
                style="margin-right: -25px; margin-left: -10px; color: #006eff"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>

              <el-button
                v-permissions="'user:cloud:delete'"
                type="text"
                size="small"
                style="margin-right: -2px; color: #006eff"
                @click="cloudStore.deleteCloud(scope.row)"
              >
                删除
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />

                  <!-- <el-icon style="margin-left: 2px"><arrow-down /></el-icon> -->
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item class="dropdown-item-buttons" @click="openKubectl(scope.row)">
                      打开终端
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template #empty>
            <div class="table-inline-word">
              选择的该地区的集群列表为空，你可以
              <button class="table-inline-btn" @click="cloudStore.createCloud">[新建]</button>
              ，或切换到其他地区
            </div>
          </template>
        </el-table>

        <!-- 分页区域 -->
        <pagination :total="cloudStore.total" @on-change="cloudStore.onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <el-dialog
    v-model="cloudStore.editAliasName"
    style="color: #000000; font: 14px"
    width="500px"
    center
    @close="cloudStore.closeModal"
  >
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">修改集群名称</div>
    </template>

    <el-form style="max-width: 440px">
      <el-form-item label="集群名称">
        <el-input v-model="cloudStore.selectCloudAliasName" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -18px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="cloudStore.closeModal">取消</el-button>
        <el-button
          class="pixiu-small-confirm-button"
          type="primary"
          @click="cloudStore.changeAliasName"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="cloudStore.createCloudVisible"
    style="color: #000000; font: 14px"
    width="1200px"
    center
    @close="cloudStore.closeModal"
  >
    <template #title>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">选择集群类型</div>
    </template>
    <el-row :gutter="20">
      <pixiu-radio-card
        :type="1"
        :default-type="cloudStore.cloudType"
        :span="2"
        @click="cloudStore.changeActive"
        ><div>
          <div style="margin-top: 10px; font: 14px; font-weight: 700; color: #000000">标准集群</div>

          <div style="margin-top: 20px; font: 12px; color: #00000066">
            可以将用户本地基础设施的 Kubernetes 集群或者其他云厂商的 Kubernetes
            集群注册到容器服务进行统一管理。
          </div>
          <div style="margin-top: 20px; color: #000 !important">多云管理，灵活接入各种计算资源</div>
          <div style="margin-top: 8px; color: #000 !important">
            对接现有 DevOps 系统，实现多云发布
          </div>
          <div style="margin-top: 8px; color: #000 !important">完全兼容开源 Kubernetes 集群</div>
          <div style="margin-top: 20px; color: #000 !important; margin-bottom: 50px">
            生态开源 多云管理
          </div>
        </div></pixiu-radio-card
      >

      <pixiu-radio-card
        :type="2"
        :default-type="cloudStore.cloudType"
        :span="2"
        @click="cloudStore.changeActive"
      >
        <div style="margin-top: 10px; font: 14px; font-weight: 700; color: #000000">自建集群</div>

        <div style="margin-top: 20px; font: 12px; color: #00000066">
          默认集群类型，完全兼容开源 Kubernetes
          集群标准功能，并强化节点管理、集群网络、容器调度等能力。
        </div>

        <div style="margin-top: 20px; color: #000 !important">
          标准原生 Kubernets 集群、丰富的自定义接口
        </div>
        <div style="margin-top: 8px; color: #000 !important">适用于高稳定性、定制化集群业务</div>
        <div style="margin-top: 8px; color: #000 !important">灵活的集群网络、容器调度</div>
        <div style="margin-top: 20px; color: #000 !important; margin-bottom: 50px">
          标准K8s集群 支持原生节点
        </div>
      </pixiu-radio-card>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-cancel-button" @click="cloudStore.closeModal">取消</el-button>
        <el-button class="pixiu-confirm-button" type="primary" @click="confirmCreateCloud"
          >创建</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog
    :model-value="cloudStore.showDeleteModal"
    style="color: #191919; font: 14px"
    width="480px"
    align-center
    center
    @close="cloudStore.cancelDeleteCloud"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 6px;
          margin-top: 5px;
          margin-bottom: 20px;
          font-size: 14.5px;
        "
      >
        删除集群
      </div>
    </template>

    <el-card class="app-docs" style="margin-left: 7px; margin-top: -20px; margin-right: 7px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -30px"
        ><WarningFilled
      /></el-icon>

      <div style="vertical-align: middle; margin-top: -30px">
        此操作将永久删除集群 (<span style="color: red"> {{ cloudStore.preDeleteCloudName }}</span
        >)， 是否继续？
      </div>
    </el-card>

    <div style="margin-top: -10px" />
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cloudStore.cancelDeleteCloud"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="cloudStore.confirmDeleteCloud"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 8px" />
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { getCurrentInstance, onMounted, onBeforeUnmount, onBeforeMount, reactive } from 'vue';
import Description from '@/components/description/index.vue';
import PixiuRadioCard from '@/components/radioCard/index.vue';
import Icon from '@/components/pixiuTooltip/index.vue';
import Pagination from '@/components/pagination/index.vue';
import useCloudStore from '@/stores/useCloud';
import { formatterTime, formatterClusterNode } from '@/utils/formatter';
import { changeClusterProtected } from '@/services/cloudService';
import { copy } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const cloudStore = useCloudStore();
const { proxy } = getCurrentInstance();

const data = reactive({
  timer: null,
});

onMounted(() => {
  cloudStore.getCloudList();
});

onBeforeMount(() => {
  data.timer = window.setInterval(() => {
    cloudStore.getCloudList();
  }, 5000);
});
onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

// const cloudStatus = {
//   0: '运行中',
//   1: '集群异常',
//   2: '构建中',
//   3: '删除中',
//   4: '等待构建',
// };

const changeProtectStatus = async (row) => {
  const [result, err] = await changeClusterProtected(row.id, row.resource_version, row.protected);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  row.resource_version = row.resource_version + 1;
};

const cloudStatus = {
  0: {
    icon: 'icon-B',
    text: '运行中',
    color: '#00FF00', // 绿色
  },
  1: {
    icon: 'icon-yichang',
    text: '集群异常',
    color: '#FF0000', // 红色
  },
  2: {
    icon: 'icon-dlf-shujuhugoujian',
    text: '构建中',
    color: '#0000FF', // 蓝色
  },
  3: {
    icon: 'icon-shanchu',
    text: ' 删除中',
    color: '#FF00FF', // 牡丹红
  },
  4: {
    icon: 'icon-icon-',
    text: '等待构建',
    color: '#FFFF00', // 黄色
  },
};

const cloudTypes = {
  0: '标准集群',
  1: '自建集群',
};

const cloudTypeFormatter = (row, column, cellValue) => (
  <div class="pixiu-table-formatter">
    <el-space>
      <div>{cloudTypes[cellValue]}</div>
    </el-space>
  </div>
);

const cloudVersionFormatter = (row, column, cellValue) => (
  <div class="pixiu-table-formatter">
    <el-space>
      <div>{cellValue}</div>
    </el-space>
  </div>
);

const statusText = {
  0: '运行中',
  1: '部署中',
  2: '等待部署',
  3: '部署失败',
  4: '集群异常',
};

const formatterResource = (row, column, cellValue) => {
  return (
    <div style="display:flex;flex-direction:column">
      <el-space>
        <span style="font-weight:bold;font-size: 12px">CPU:</span>
        <span style="font-weight:bold;font-size: 12px">{cellValue['cpu']}</span>
      </el-space>
      <el-space>
        <span style="font-weight:bold;font-size: 12px">内存:</span>
        <span style="font-weight:bold;font-size: 12px">{cellValue['memory']}</span>
      </el-space>
    </div>
  );
};

const handleEdit = (row) => {
  proxy.$notify.warning('暂不支持');
};

const openKubectl = (row) => {
  proxy.$notify.warning('暂不支持');
};

const jumpRoute = (row) => {
  if (row.status === 0) {
    localStorage.setItem(row.name, row.alias_name);
    localStorage.setItem('clusterId', row.id);

    router.push({
      name: 'Info',
      query: {
        cluster: row.name,
      },
    });
  } else if (row.status === 1) {
    ElMessage({
      type: 'error',
      message: '集群正在创建中，请稍后再试',
    });
  } else if (row.status === 2) {
    ElMessage({
      type: 'error',
      message: '集群还未启动部署，请先启动部署',
    });
  } else if (row.status === 3) {
    ElMessage({
      type: 'error',
      message: '集群部署失败，请检查部署日志',
    });
  }
};

// 根据选择的类型跳转到不同操作页面
const confirmCreateCloud = () => {
  const name = cloudStore.cloudType === 1 ? 'InsertCluster' : 'PlanCreate';
  cloudStore.createCloudVisible = false;
  router.push({
    name,
  });
};
</script>

<style>
.box-card {
  margin-top: 20px;
  /* width: 480px; */
  border-radius: 0px;
}

.el-main {
  background-color: #f3f4f7;
}

.app-docs {
  margin-top: 20px;
  height: 60px;
  font-size: 12px;
  line-height: inherit;
  padding: 14px 20px;
  vertical-align: middle;
  color: #002da0;
  border: 1px solid #d5e7ff;
  border-radius: 0;
  background: #d5e7ff;
  position: relative;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 26px;
  color: #28c65a;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
