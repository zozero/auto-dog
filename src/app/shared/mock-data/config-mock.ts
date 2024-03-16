import { MyMenuItemType } from '../../app-data';

export const simulatorType = ['安卓', '其他'];

export const myMenuListmyMenuList: MyMenuItemType[] = [
  {
    icon: 'icon-more-func',
    name: '配置',
  },
  {
    icon: 'icon-more-func',
    name: '图片处理',
  },
  {
    icon: 'icon-more-func',
    name: '流程规划',
  },
  {
    icon: 'icon-more-func',
    name: '表格编辑',
  },
];

export const defaultConfigData = {
  version: '1.0',
};
// 模拟器
export const defaultSimulatorInfo = {
  name: '模拟器1',
  type: '安卓',
  ipPort: 'http://127.0.0.1:5555',
};
// 执行端
export const defaultExecutionSideInfo = {
  ipPort: 'http://127.0.0.1:28888',
};
// 项目名
export const defaultProjectData = {
  name: '项目1',
};
