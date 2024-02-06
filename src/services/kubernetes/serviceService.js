import http from '@/utils/http';
import { awaitWrap } from '@/utils/utils';

export const getServiceList = async (cluster, namespace) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'get',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services`,
    }),
  );
  return [err, result];
};

export const updateService = async (cluster, namespace, name, data) => {
  const [err, result] = await awaitWrap(
    http({
      method: 'put',
      url: `/proxy/pixiu/${cluster}/api/v1/namespaces/${namespace}/services/${name}`,
      data: data,
    }),
  );
  return [result, err];
};
