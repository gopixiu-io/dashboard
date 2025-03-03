import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';
import { getHeadersWithToken } from '@/utils/utils';

export const getPodList = async (cluster, namespace) => {
  let url = `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`;
  if (namespace === '全部空间') {
    url = `/pixiu/proxy/${cluster}/api/v1/pods`;
  }
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: {
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getPodListByCache = async (cluster, namespace, params) => {
  let url = `/pixiu/indexer/clusters/${cluster}/resources/pod/namespaces/${namespace}`;
  if (namespace === '全部空间') {
    url = `/pixiu/indexer/clusters/${cluster}/resources/pod/namespaces/all_namespaces`;
  }
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: url,
      data: params,
    }),
  );
  return [result, err];
};

export const getPod = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
    }),
  );
  return [result, err];
};

export const getPodByName = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
      data: {},
    }),
  );
  return [result, err];
};

export const deletePod = async (cluster, namespace, name) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'delete',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}`,
    }),
  );
  return [result, err];
};

export const createPod = async (cluster, namespace, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'post',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`,
      data: data,
    }),
  );
  return [result, err];
};

export const getPodsByNode = async (cluster, nodeName) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/pods`,
      data: {
        fieldSelector: 'spec.nodeName=' + nodeName,
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getPodsByLabels = async (cluster, namespace, labels) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods`,
      data: {
        labelSelector: labels,
        limit: 500,
      },
    }),
  );
  return [result, err];
};

export const getPodLog = async (cluster, namespace, name, container, line) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/log`,
      data: {
        container: container,
        tailLines: line,
      },
    }),
  );
  return [result, err];
};

export const getPodContainerLog = async (cluster, namespace, name, container, line) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/pixiu/proxy/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/log`,
      data: {
        container: container,
        tailLines: line,
      },
    }),
  );
  if (err) {
    return [result, err];
  }
  if (result === '') {
    return [[], err];
  }
  return [result.split('\n'), err];
};

export const getPodContainersLog = async (cluster, namespace, name, containers, line) => {
  let logs = [];
  for (let i = 0; i < containers.length; i++) {
    const [log, err] = getPodContainerLog(cluster, namespace, name, containers[i], line);
    if (err) {
      return [logs, err];
    }
    logs = logs.concat(log);
  }
  return [logs, err];
};

export const watchPodLog = (cluster, namespace, name, container, line) => {
  const baseUrl = http({ method: 'watch' });
  const url = `${baseUrl}/pixiu/kubeproxy/clusters/${cluster}/namespaces/${namespace}/pods/${name}/log?container=${container}&tailLines=${line}`;
  const ws = new WebSocket(url);
  return ws;
};
