import { MyMenuItemType } from '../../app-data';

export const simulatorType = ['安卓', '其他'];

export const myMenuListmyMenuList: MyMenuItemType[] = [
  {
    icon: 'icon-more-func',
    name: '基础配置',
  },
  {
    icon: 'icon-more-func',
    name: '执行规划',
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
    name: '图片展馆',
  },
  {
    icon: 'icon-more-func',
    name: '方法编辑',
  },
  {
    icon: 'icon-more-func',
    name: '步骤编辑',
  },
  {
    icon: 'icon-more-func',
    name: '任务编辑',
  },
];

export const defaultConfigData = {
  version: '1.0',
};
// 模拟器
export const defaultSimulatorInfo = {
  name: '模拟器1',
  type: '安卓',
  ipPort: '127.0.0.1:5555',
};
// 执行端
export const defaultExecutionSideInfo = {
  ipPort: 'http://127.0.0.1:8888',
};
// 项目名
export const defaultProjectData = {
  name: '项目1',
};

export const defaultEncode="gbk"