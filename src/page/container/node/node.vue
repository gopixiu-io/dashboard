<template>
  <!-- <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getNodes" title="节点管理" :display-namespace="false"></PiXiuYaml>
    </div>
  </div> -->
  <Description
    :description="'Kubernetes 通过将容器放入在节点（Node）上运行的 Pod 中来执行你的工作负载。 节点可以是一个虚拟机或者物理机器，取决于所在的集群配置。 每个节点包含运行 Pod 所需的服务。'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" style="width: 90px" @click="addNode">新增节点</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getNodes">刷新</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="getNodes"
          />
        </div>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNodes"
          @input="searchNodes"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getNodes"
            />

            <!-- <el-icon class="el-input__icon" @click="getNodes">
              <component :is="'Search'" />
            </el-icon> -->
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.tableData"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        header-row-class-name="pixiu-table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="节点名称">
          <template #default="scope">
            <div style="display: flex">
              <div>
                <el-link
                  class="global-table-world"
                  :underline="false"
                  type="primary"
                  @click="jumpRoute(scope.row)"
                >
                  {{ scope.row.metadata.name }}
                </el-link>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" :formatter="formatterNodeStatus">
        </el-table-column>

        <!--
        <el-table-column label="角色" prop="metadata" :formatter="formatNodeRole">
        </el-table-column> -->

        <!-- <el-table-column label="节点配置" prop="status" :formatter="formatIp"> </el-table-column> -->
        <el-table-column label="IP地址" prop="status" :formatter="formatNodeIp"> </el-table-column>

        <el-table-column label="节点版本" prop="status.nodeInfo.kubeletVersion"> </el-table-column>
        <el-table-column
          label="运行时"
          prop="status.nodeInfo.containerRuntimeVersion"
          :formatter="formatString"
        >
        </el-table-column>
        <!--
        <el-table-column label="可调度">
          <template #default="scope">
            <el-switch
              v-model="scope.row.spec.unschedulable"
              inline-prompt
              style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
              size="small"
              @change="changeNodeSchedule(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column> -->

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              class="table-item-left1-buttom"
              @click="handleMonitorDrawer(scope.row)"
            >
              监控
            </el-button>

            <el-button
              type="text"
              size="small"
              class="table-item-left2-buttom"
              @click="handleEventDrawer(scope.row)"
            >
              事件
            </el-button>
            <el-dropdown>
              <span class="cluster-dropdown">
                更多
                <div style="margin-left: 2px"></div>
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item class="dropdown-item-buttons" @click="viewYaml(scope.row)">
                    查看YAML
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleEditLabelDialog(scope.row)"
                  >
                    标签管理
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="changeNodeSchedule(scope.row)"
                  >
                    <div v-if="scope.row.spec.unschedulable">开启调度</div>
                    <div v-else>禁止调度</div>
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleDrainDialog(scope.row)"
                  >
                    清空节点
                  </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons"> 删除 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <el-dialog
    :model-value="data.labelData.close"
    style="color: #000000; font: 14px"
    width="720px"
    align-center
    center
    @close="cancelEditLabel"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        标签管理
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        附加到 Kubernetes 对象上的键值对，用于指定对用户有意义且相关的对象的标识属性。
      </div>
    </el-card>

    <el-form style="margin-top: 5px">
      <el-form-item
        v-for="(item, index) in data.labelData.labels"
        :key="index"
        style="margin-top: -10px"
      >
        <el-form-item prop="item.key">
          <el-input v-model="item.key" style="width: 300px" />
        </el-form-item>
        <div>
          <el-input v-model="item.value" style="width: 300px; margin-left: 20px" />
        </div>
        <div
          class="table-inline-btn"
          style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
          @click="deleteLabel(index)"
        >
          删除
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          class="table-inline-btn"
          style="margin-left: -14px; margin-right: -20px; cursor: pointer"
          @click="addLabel"
          >+ 添加</el-button
        >
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelEditLabel">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmEditLabel"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <el-dialog
    :model-value="data.drainData.close"
    style="color: #000000; font: 14px"
    width="530px"
    align-center
    center
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        清空节点
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        此操作将清空节点上的 Pod，在节点清空期间，不要求应用具有高可用性。
      </div>
    </el-card>

    <div style="margin-top: -25px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelDrain">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmDrain"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit :yaml-dialog="data.yamlDialog" :yaml="data.yaml"></PiXiuViewOrEdit>

  <el-drawer
    v-model="data.monitorData.drawer"
    :size="data.drawerWidth"
    :with-header="false"
    @close="closeMonitorDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          资源监控
        </div>
        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">查看 Node 的资源状态</div>
        </el-card>
      </div>
      <el-space style="margin-left: 8px; margin-top: 15px" wrap :fill-ratio="48">
        <Echart :option="data.monitorData.cpuOption" :width="'640px'" :height="'250px'"></Echart>
        <Echart :option="data.monitorData.memoryOption" :width="'640px'" :height="'250px'"></Echart>
      </el-space>
    </div>
  </el-drawer>

  <el-drawer
    v-model="data.eventData.drawer"
    :size="data.eventData.width"
    :with-header="false"
    @close="closeEventDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          事件查询
        </div>

        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">获取 Node 的事件</div>
        </el-card>

        <el-row>
          <el-col>
            <div style="margin-left: 8px">
              <button class="pixiu-two-button" @click="getNodeEvents">查询</button>
              <button
                style="margin-left: 10px; width: 85px"
                class="pixiu-two-button2"
                @click="deleteEventsInBatch"
              >
                批量删除
              </button>
            </div>
          </el-col>
        </el-row>

        <div style="margin-top: 25px">
          <el-table
            v-loading="data.eventData.loading"
            :data="data.eventData.eventTableData"
            stripe
            style="margin-top: 6px"
            header-row-class-name="pixiu-table-header"
            :cell-style="{
              'font-size': '12px',
              color: '#191919',
            }"
            @selection-change="handleEventSelectionChange"
          >
            <el-table-column type="selection" width="30" />
            <el-table-column
              prop="lastTimestamp"
              label="最后出现时间"
              sortable
              :formatter="formatterTime"
            />
            <el-table-column prop="type" label="级别" />
            <el-table-column prop="involvedObject.kind" label="资源类型"> </el-table-column>
            <el-table-column prop="involvedObject.name" label="资源名称" :formatter="formatString">
            </el-table-column>
            <el-table-column prop="count" label="出现次数" width="80px"> </el-table-column>
            <el-table-column prop="message" label="内容" min-width="250px" />

            <template #empty>
              <div class="table-inline-word">暂无事件</div>
            </template>
          </el-table>
          <pagination
            :total="data.eventData.pageEventInfo.total"
            @on-change="onEventChange"
          ></pagination>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getCurrentInstance, onMounted, onUnmounted, provide, reactive } from 'vue';
import { getTableData, searchData } from '@/utils/utils';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { drainNode, getNode, getNodeList, patchNode } from '@/services/kubernetes/nodeService';
import { formatNodeIp, formatString, formatterNodeStatus, formatterTime } from '@/utils/formatter';
import { deleteEvent, getRawEventList } from '@/services/kubernetes/eventService';
import Echart from '@/components/echarts/index.vue';
import { getNodeUsageMetrics } from '@/services/kubernetes/metricsService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',

  loading: false,
  noLoading: false,

  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  drawerWidth: '70%',

  tableData: [],

  yamlDialog: false,
  yaml: '',
  nodeList: [],

  labelData: {
    close: false,
    name: '',
    labels: [],
  },

  drainData: {
    close: false,
    name: '',
  },

  pageEventInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  eventData: {
    drawer: false,
    loading: false,
    width: '80%',

    node: '',
    eventTableData: [],
    events: [],
    multipleEventSelection: [],

    pageEventInfo: {
      page: 1,
      limit: 10,
      total: 0,
      search: {
        field: 'name',
        searchInfo: '',
      },
    },
  },

  monitorData: {
    drawer: false,
    timer: null,
    cpuOption: {
      tooltip: {
        confine: true,
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '5%'];
        },
      },
      title: {
        left: '0',
        text: 'CPU使用率（%）',
        textStyle: {
          fontSize: 13,
          fontWeight: 'bold',
          color: '#191919',
        },
      },

      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        // name: 'CPU（ cores ）',
        // nameLocation: 'middle',
        // nameGap: 30,
        nameTextStyle: {
          fontSize: 13,
          color: '#191919',
        },
      },

      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#5dd183',
          },
          areaStyle: {
            color: '#5dd183',
          },
          data: [],
        },
      ],
    },
    memoryOption: {
      tooltip: {
        confine: true,
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '5%'];
        },
        formatter: function (params) {
          let str =
            params[0].axisValueLabel +
            '<br/>' +
            params[0].marker +
            params[0].seriesName +
            '<span style="margin-left: 15px; font-size: 13px; color: green">';
          let v = params[0].value[1];
          if (v >= 1024 * 1024 * 1024) {
            str += (v / 1024 / 1024 / 1024).toFixed(2) + ' GB';
          } else {
            str += (v / 1024 / 1024).toFixed(2) + ' MB';
          }
          str += '</span>';
          return str;
        },
        axisPointer: {},
      },
      title: {
        left: '0px',
        text: '内存使用量',
        textStyle: {
          fontSize: 13,
          fontWeight: 'bold',
          color: '#191919',
        },
      },

      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            if (value >= 1024 * 1024 * 1024) {
              return (value / 1024 / 1024 / 1024).toFixed(0) + ' GB';
            } else {
              return (value / 1024 / 1024).toFixed(0) + ' MB';
            }
          },
        },
      },
      series: [
        {
          name: 'Memory Usage',
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#a8baee',
          },
          areaStyle: {
            color: '#a8baee',
          },
          data: [],
        },
      ],
    },
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNodes();
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.nodeList);
};

const addNode = async () => {
  proxy.$notify.warning({ message: '暂不支持，功能开发中' });
};

const getNodes = async () => {
  if (!data.noLoading) {
    data.loading = true;
  }
  const [result, err] = await getNodeList(data.cluster);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.nodeList = result.items;
  data.pageInfo.total = data.nodeList.length;
  data.tableData = getTableData(data.pageInfo, data.nodeList);
};
provide('getNodes', getNodes);

const searchNodes = async () => {
  data.tableData = searchData(data.pageInfo, data.nodeList);
};

const jumpRoute = (row) => {
  router.push({
    name: 'NodeDetail',
    query: {
      cluster: data.cluster,
      name: row.metadata.name,
    },
  });
};

const changeNodeSchedule = async (row) => {
  const patchData = {
    spec: {
      unschedulable: !row.spec.unschedulable,
    },
  };
  const [result, err] = await patchNode(data.cluster, row.metadata.name, patchData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.noLoading = true;
  await getNodes();
  data.noLoading = false;
};

const parseMetrics = (metricPoints) => {
  return metricPoints.map(({ timestamp, value }) => [new Date(timestamp).getTime(), value]);
};

const parseCPUMetrics = (metricPoints, totalCpu) => {
  return metricPoints.map(({ timestamp, value }) => [
    new Date(timestamp).getTime(),
    (value / totalCpu).toFixed(2),
  ]);
};
const getNodeMetricsInfo = async (name, totalCpu, totalMemory) => {
  const [cpuUsage] = await getNodeUsageMetrics(data.cluster, name, 'cpu', 'usage');
  data.monitorData.cpuOption.series[0].data = parseCPUMetrics(
    cpuUsage.items[0].metricPoints,
    totalCpu,
  );
  const [memoryUsage] = await getNodeUsageMetrics(data.cluster, name, 'memory', 'usage');
  data.monitorData.memoryOption.series[0].data = parseMetrics(memoryUsage.items[0].metricPoints);
};

const handleMonitorDrawer = async (row) => {
  const nodeNme = row.metadata.name;
  //值为3600m
  const totalCpu = parseInt(row.status.capacity.cpu) * 1000;
  const totalMemory = parseInt(row.status.capacity.memory.replace('Ki', ''));
  await getNodeMetricsInfo(nodeNme, totalCpu, totalMemory);
  data.monitorData.drawer = true;
  data.monitorData.timer = setInterval(async () => {
    await getNodeMetricsInfo(nodeNme, totalCpu, totalMemory);
  }, 3000);
};

const closeMonitorDrawer = () => {
  //关闭定时器
  if (data.monitorData.timer) {
    clearInterval(data.monitorData.timer);
  }
};
onUnmounted(() => {
  if (data.monitorData.timer) {
    clearInterval(data.monitorData.timer);
  }
});

// 事件函数开始
const handleEventSelectionChange = (events) => {
  data.eventData.multipleEventSelection = [];
  for (let event of events) {
    data.eventData.multipleEventSelection.push(event.metadata.name);
  }
};

const onEventChange = (v) => {
  data.eventData.pageEventInfo.limit = v.limit;
  data.eventData.pageEventInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageEventInfo, data.eventData.events);
};

const handleEventDrawer = (row) => {
  data.eventData.node = row;
  data.eventData.drawer = true;
};

const getNodeEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getRawEventList(
    data.cluster,
    data.eventData.node.metadata.name,
    '',
    data.eventData.node.metadata.name,
    'Node',
    false,
  );
  data.eventData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.eventData.events = result;
  data.eventData.pageEventInfo.total = result.length;
  data.eventData.eventTableData = getTableData(data.eventData.pageEventInfo, data.eventData.events);
};

const closeEventDrawer = () => {
  data.eventData = {
    drawer: false,
    loading: false,
    width: '80%',
    node: '',
    eventTableData: [],
    events: [],
    multipleEventSelection: [],
    pageEventInfo: {
      page: 1,
      limit: 10,
      total: 0,
      search: {
        field: 'name',
        searchInfo: '',
      },
    },
  };
};

const deleteEventsInBatch = async () => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, 'default', event);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  proxy.$notify.success('批量删除事件成功');
  getNodeEvents();
};

// 事件函数结束

const handleDrainDialog = async (row) => {
  data.drainData.close = true;
  data.drainData.name = row.metadata.name;
};

const cancelDrain = () => {
  data.drainData.close = false;
  data.drainData.name = '';
};

const confirmDrain = async () => {
  const [node, err] = await drainNode(data.cluster, data.drainData.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  cancelDrain();
};

const addLabel = () => {
  data.labelData.labels.push({ key: '', value: '' });
};

const deleteLabel = (index) => {
  data.labelData.labels.splice(index, 1);
};

const handleEditLabelDialog = async (row) => {
  data.labelData.name = row.metadata.name;
  data.labelData.labels = [];

  const [node, err1] = await getNode(data.cluster, data.labelData.name);
  if (err1) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  const labels = node.metadata.labels;
  if (labels !== undefined) {
    for (let label in labels) {
      data.labelData.labels.push({
        key: label,
        value: labels[label],
      });
    }
  }

  data.labelData.close = true;
};

const cancelEditLabel = () => {
  data.labelData.close = false;
  data.labelData.name = '';
  data.labelData.labels = [];
};

const confirmEditLabel = async () => {
  const newLabels = {};
  for (let item of data.labelData.labels) {
    newLabels[item.key] = item.value;
  }

  const [node, err1] = await getNode(data.cluster, data.labelData.name);
  if (err1) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  const oldLabels = node.metadata.labels;
  for (let key in oldLabels) {
    if (key in newLabels) {
      continue;
    }
    newLabels[key] = null;
  }

  const patchData = {
    metadata: {
      labels: newLabels,
    },
  };
  const [res, err] = await patchNode(data.cluster, data.labelData.name, patchData);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  cancelEditLabel();
};

const viewYaml = async (row) => {
  data.labelData.name = row.metadata.name;

  const [node, err] = await getNode(data.cluster, data.labelData.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.yamlDialog = true;
  data.yaml = node;
};
</script>

<style scoped="scoped"></style>
