<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToNode">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-zongrongqizu" size="75px" type="iconfont" color="#006eff" />
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 80px;
        "
      >
        <div
          class="breadcrumb-create-style"
          style="font-size: 17px; margin-top: -10px; margin-left: 10px"
        >
          {{ data.name }}
        </div>

        <div style="margin-bottom: 10px">
          <span class="detail-card-key-style" style="font-size: 12.5px">创建时间 </span>
          <span class="detail-card-value-style" style="margin-left: 5px; font-size: 12.5px">
            {{ data.createTime }}</span
          >
        </div>

        <div style="margin-bottom: -10px; margin-left: 10px">
          <button class="pixiu-two-button" @click="GetNode">刷新</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
          </button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="ChangeToRemoteLoginTab"
          >
            远程登陆
          </button>

          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
            更多操作
          </button>
        </div>
      </div>
    </el-space>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      class="detail-tabs-style"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器组" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"></el-tab-pane>
      <el-tab-pane label="监控指标" name="four"> </el-tab-pane>
      <el-tab-pane label="远程登陆" name="five"> </el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
              >基本信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">节点名称 </span>
            <span class="detail-card-value-style"> {{ data.object.metadata.name }}</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">操作系统 </span>
              <span class="detail-card-value-style">
                {{ data.object.status.nodeInfo.osImage }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">创建时间 </span>
              <span class="detail-card-value-style"> {{ data.createTime }}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">运行状态 </span>
            <span class="detail-card-value-style"> Running</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">容器运行时 </span>
              <span class="detail-card-value-style" style="margin-left: 17px">
                {{ data.object.status.nodeInfo.containerRuntimeVersion }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">kubelet版本 </span>
              <span class="detail-card-value-style" style="margin-left: 15px">
                {{ data.object.status.nodeInfo.kubeletVersion }}
              </span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">PodCIDRs </span>
            <span class="detail-card-value-style" style="margin-left: 22px">
              {{ data.object.spec.podCIDR }}</span
            >
          </el-col>

          <el-col :span="8">
            <span class="detail-card-key-style">内核版本 </span>
            <span class="detail-card-value-style">
              {{ data.object.status.nodeInfo.kernelVersion }}</span
            >
          </el-col>
        </el-row>

        <el-form style="margin-top: 30px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >元数据
              </span>
            </template>
          </el-form-item>
        </el-form>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item style="margin-top: -15px">
              <template #label>
                <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                  >标签
                </span>
              </template>
            </el-form-item>
            <el-form-item style="margin-top: -10px">
              <div v-if="data.object.metadata.labels === undefined" style="margin-left: 10px">
                -
              </div>
              <div v-else style="margin-top: -8px">
                <div
                  v-for="(item, index) in data.object.metadata.labels"
                  :key="item"
                  style="font-size: 14px"
                >
                  <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                    >{{ index }}: {{ item }}</el-tag
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item style="margin-top: -10px">
              <template #label>
                <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                  >注释
                </span>
              </template>
            </el-form-item>
            <el-form-item style="margin-top: -10px">
              <div v-if="data.object.metadata.annotations === undefined" style="margin-left: 10px">
                -
              </div>
              <div v-else style="margin-top: -8px">
                <div
                  v-for="(item, index) in data.object.metadata.annotations"
                  :key="item"
                  style="font-size: 14px"
                >
                  <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                    >{{ index }}: {{ item }}</el-tag
                  >
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="data.activeName === 'second'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理运行在 node 上的全部 pod 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="getNodePods"
            >
              查询
            </button>

            <el-input
              v-model="data.pageInfo.search.searchInfo"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="getNodePods"
              @input="getNodePods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="getNodePods"
                />
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.podData.loading"
        :data="data.podData.tableData"
        stripe
        style="margin-top: 10px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称" min-width="120px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column prop="metadata.namespace" label="命名空间"> </el-table-column>

        <!-- <el-table-column prop="metadata.namespace" label="命名空间" :formatter="formatterNamespace">
        </el-table-column> -->

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="60px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.podData.pageInfo.total" @on-change="onChange"></pagination>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          Node 关联事件查询，更多查询请至事件中心
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button class="pixiu-two-button" @click="getNodeEvents">查询</button>
            <button
              style="margin-left: 10px; width: 85px"
              class="pixiu-two-button2"
              @click="handleDeleteEventsDialog"
            >
              批量删除
            </button>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.eventData.loading"
        :data="data.eventData.eventTableData"
        stripe
        style="margin-top: 10px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleEventSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="involvedObject.kind" label="资源类型"> </el-table-column>
        <el-table-column prop="count" label="出现次数"> </el-table-column>
        <el-table-column prop="message" label="内容" min-width="260px" />
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.eventData.pageInfo.total" @on-change="onEventChange"></pagination>
    </div>

    <div v-if="data.activeName === 'five'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          基于 WebShell 通过 bash 提供 ssh 登陆节点的功能
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px; display: flex">
            <button class="pixiu-two-button">登陆</button>
            <button
              style="margin-left: 10px; width: 85px"
              class="pixiu-two-button2"
              @click="handleHostRemoteLoginDialog"
            >
              设置凭证
            </button>

            <div class="dialog-label-key-style" style="margin-left: 20px; margin-top: 5px">
              节点地址:
            </div>
            <div class="dialog-label-key-style" style="margin-left: 10px; margin-top: 5px">
              {{ data.remoteLogin.ip }}
            </div>

            <div class="dialog-label-key-style" style="margin-left: 20px; margin-top: 5px">
              SSH端口:
            </div>
            <div class="dialog-label-key-style" style="margin-left: 10px; margin-top: 5px">
              {{ data.remoteLogin.port }}
            </div>
          </div>
        </el-col>
      </el-row>

      <div ref="terminalContainer" class="terminal-container"></div>
    </div>
  </el-card>

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="GetNode"
  ></PiXiuViewOrEdit>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <pixiuDialog
    :close-event="data.deleteEventDialog.close"
    :object-name="data.deleteEventDialog.objectName"
    :delete-name="data.deleteEventDialog.deleteName"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  ></pixiuDialog>

  <el-dialog
    :model-value="data.remoteLogin.close"
    style="color: #000000; font: 14px"
    width="500px"
    align-center
    center
    draggable
    @close="cancelHostRemoteLogin"
  >
    <template #header>
      <div class="dialog-header-style">设置登陆凭证</div>
    </template>

    <el-form>
      <el-form-item>
        <template #label>
          <span class="dialog-label-key-style"> 登陆端口</span>
        </template>
        <div class="dialog-label-value-style">
          <el-input
            v-model="data.remoteLogin.port"
            clearable
            style="margin-left: 3px; width: 50%"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span class="dialog-label-key-style">用户名</span>
        </template>
        <div class="dialog-label-value-style" style="margin-left: 16px; width: 50%">
          <el-input v-model="data.remoteLogin.user" clearable />
        </div>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span class="dialog-label-key-style">密码</span>
        </template>
        <div class="dialog-label-value-style" style="margin-left: 29px; width: 50%">
          <el-input v-model="data.remoteLogin.password" clearable show-password />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelHostRemoteLogin"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="pixiu-delete-confirm-button"
          @click="confirmHostRemoteLogin"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { getCurrentInstance, onMounted, ref, reactive } from 'vue';
import { getNode } from '@/services/kubernetes/nodeService';
import { getPodsByNode, deletePod } from '@/services/kubernetes/podService';
import { getTableData, formatTimestamp } from '@/utils/utils';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import { formatterPodStatus, formatterRestartCount, formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { deleteEvent, getNodeEventList } from '@/services/kubernetes/eventService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import 'xterm/lib/xterm.js';

const msgData = '1';
const msgResize = '2';
const terminalContainer = ref(null);
let terminal;
let fitAddon;

const { proxy } = getCurrentInstance();

const data2 = reactive({
  rows: 20,
  cols: 80,
});

const data = reactive({
  name: '',
  cluster: '',

  activeName: 'first',

  object: {
    metadata: {},
    spec: {},
    status: {
      nodeInfo: '',
    },
  },
  createTime: '',

  pageInfo: {
    page: 1,
    total: 0,
    limit: 5,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  nodePods: [],
  podData: {
    loading: false,
    pods: [],
    tableData: [],
    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },
  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
    namespace: '',
  },

  // 删除对象属性
  deleteEventDialog: {
    close: false,
    objectName: 'events',
    deleteName: 'events',
    namespace: '',
  },

  nodeEvents: [],
  eventData: {
    loading: false,

    eventTableData: [],
    multipleEventSelection: [],

    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

  remoteLogin: {
    close: false,
    ip: '',
    user: '',
    password: '',
    port: '22',
  },

  yaml: '',
  yamlName: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;

  GetNode();
});

const GetNode = async () => {
  const [result, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
};

const getNodePods = async () => {
  data.podData.loading = true;
  const [result, err] = await getPodsByNode(data.cluster, data.name);
  data.podData.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }

  data.podData.pods = result.items;
  data.podData.pageInfo.total = data.podData.pods.length;
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
};

const onChange = (v) => {
  data.podData.pageInfo.limit = v.limit;
  data.podData.pageInfo.page = v.page;
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {
  if (name === 'second') {
    getNodePods();
  }
  if (name === 'third') {
    getNodeEvents();
  }

  if (name === 'five') {
    let ip;
    for (let i = 0; i < data.object.status.addresses.length; i++) {
      if (data.object.status.addresses[i].type === 'InternalIP') {
        ip = data.object.status.addresses[i].address;
        break;
      }
    }
    data.remoteLogin.ip = ip;
  } else {
    data.remoteLogin.ip = '';
    data.remoteLogin.port = '22';
  }
};

// 事件处理开始
const getNodeEvents = async () => {
  const [result, err] = await getNodeEventList(data.cluster, data.name, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }

  data.nodeEvents = result;
  data.eventData.pageInfo.total = result.length;
  data.eventData.eventTableData = getTableData(data.pageInfo, data.nodeEvents);
};

const onEventChange = (v) => {
  data.eventData.pageInfo.limit = v.limit;
  data.eventData.pageInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.nodeEvents);
};

const handleEventSelectionChange = (events) => {
  data.eventData.multipleEventSelection = [];
  for (let event of events) {
    data.eventData.multipleEventSelection.push(event.metadata);
  }
};
const handleDeleteEventsDialog = (row) => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  data.deleteEventDialog.close = true;
  data.deleteEventDialog.deleteName = 'events';
  data.deleteEventDialog.namespace = '';
};

const confirmEvent = async () => {
  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }

  cancelEvent();
  proxy.$notify.success('批量删除事件成功');
  getNodeEvents();
};

const cancelEvent = () => {
  data.deleteEventDialog.close = false;
  setTimeout(() => {
    data.deleteEventDialog.deleteName = '';
  }, 100);
};
// 事件处理结束

// 删除开始
const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
  data.deleteDialog.namespace = row.metadata.namespace;
};

const confirm = async () => {
  const [result, err] = await deletePod(
    data.cluster,
    data.deleteDialog.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  cancel();
  getNodePods();
};

const cancel = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

// 删除结束

// 编辑 yaml 开始
const viewYaml = async () => {
  const [node, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yaml = node;
  data.yamlDialog = true;
};
// 编辑 yaml 结束

// 远程登录开始
const ChangeToRemoteLoginTab = () => {
  data.activeName = 'five';
};

const confirmHostRemoteLogin = () => {
  if (terminalContainer.value) {
    terminal = new Terminal({
      rendererType: 'canvas', //渲染类型
      convertEol: false, //启用时，光标将设置为下一行的开头
      disableStdin: false, //是否应禁用输入
      cursorStyle: 'underline', //光标样式
      cursorBlink: true, //光标闪烁
      theme: {
        cursor: 'help', //设置光标
      },
    });
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    fitAddon.fit();
    // 初始化Xterm和FitAddon

    const baseAPI = proxy.$http({ method: 'config' });
    const websocketAddr = baseAPI.replace('http', 'ws');

    const webSocket = new WebSocket(
      websocketAddr +
        `/pixiu/kubeproxy/nodes/ws?host=${data.remoteLogin.ip}&user=${data.remoteLogin.user}&password=${data.remoteLogin.password}&port=${data.remoteLogin.port}`,
    );

    webSocket.binaryType = 'arraybuffer';
    const enc = new TextDecoder('utf-8');
    webSocket.onmessage = (event) => {
      terminal.write(enc.decode(event.data));
    };

    webSocket.onopen = () => {
      // 将终端挂载到指定的 DOM 容器中
      terminal.open(terminalContainer.value);
      fitAddon.fit();
      terminal.focus();
    };

    webSocket.onclose = () => {
      terminal.write('\r\WebTerminal quit!');
    };

    webSocket.onerror = (event) => {
      webSocket.close();
    };

    terminal.onKey((event) => {
      webSocket.send(msgData + Base64.stringify(Utf8.parse(event.key)), ArrayBuffer);
    });

    terminal.onResize(({ cols, rows }) => {
      webSocket.send(
        msgResize +
          Base64.stringify(
            Utf8.parse(
              JSON.stringify({
                columns: cols,
                rows: rows,
              }),
            ),
          ),
        ArrayBuffer,
      );
    });

    // 监听窗口大小变化事件
    window.addEventListener('resize', () => fitAddon.fit());
  }

  // data.remoteLogin.close = false;
};

const handleHostRemoteLoginDialog = () => {
  data.remoteLogin.close = true;
};

const cancelHostRemoteLogin = () => {
  data.remoteLogin.close = false;
  setTimeout(() => {
    data.remoteLogin.user = '';
    data.remoteLogin.password = '';
  }, 100);
};
// 远程登录结束

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};

const jumpRoute = (row) => {
  proxy.$router.push({
    name: 'PodDetail',
    query: {
      cluster: data.cluster,
      namespace: row.metadata.namespace,
      name: row.metadata.name,
    },
  });
};
</script>

<style scoped="scoped">
.terminal-container {
  width: 100vw;
  min-height: 40vh;
}
</style>
