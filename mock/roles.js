export default [
  {
    url: '/roles',
    method: 'GET',
    response: () => {
      return {
        code: 200,
        result: {
          roles: [
            {
              id: 21220100,
              gmt_create: '2022-10-14T15:55:38+08:00',
              gmt_modified: '2022-10-20T17:34:02+08:00',
              resource_version: 4,
              memo: '管理员',
              name: 'admin',
              sequence: 10,
              parent_id: 0,
              status: 1,
              children: null,
            },
            {
              id: 21220102,
              gmt_create: '2022-10-14T16:04:41+08:00',
              gmt_modified: '2022-10-20T17:14:27+08:00',
              resource_version: 2,
              memo: '只能查看',
              name: '查看角色',
              sequence: 4,
              parent_id: 0,
              status: 1,
              children: null,
            },
            {
              id: 21220113,
              gmt_create: '2022-10-20T19:43:16+08:00',
              gmt_modified: '2022-10-20T19:44:52+08:00',
              resource_version: 1,
              memo: '开发角色',
              name: '开发',
              sequence: 3,
              parent_id: 0,
              status: 1,
              children: null,
            },
            {
              id: 21220101,
              gmt_create: '2022-10-14T16:03:24+08:00',
              gmt_modified: '2022-10-22T20:21:41+08:00',
              resource_version: 3,
              memo: '运维角色',
              name: '运维',
              sequence: 2,
              parent_id: 0,
              status: 1,
              children: [
                {
                  id: 21220114,
                  gmt_create: '2022-10-22T17:57:32+08:00',
                  gmt_modified: '2022-10-22T18:57:19+08:00',
                  resource_version: 4,
                  memo: 'test2',
                  name: 'test2',
                  sequence: 2,
                  parent_id: 21220101,
                  status: 1,
                  children: null,
                },
              ],
            },
            {
              id: 21220103,
              gmt_create: '2022-10-14T16:07:11+08:00',
              gmt_modified: '2022-10-22T20:24:18+08:00',
              resource_version: 14,
              memo: '测试角色,拥有管理员权限',
              name: '测试角色',
              sequence: 1,
              parent_id: 0,
              status: 1,
              children: null,
            },
            {
              id: 21220107,
              gmt_create: '2022-10-18T16:48:54+08:00',
              gmt_modified: '2022-10-18T16:48:54+08:00',
              resource_version: 3,
              memo: '11',
              name: '11',
              sequence: 1,
              parent_id: 0,
              status: 1,
              children: null,
            },
          ],
          total: 7,
        },
      };
    },
  },
];
