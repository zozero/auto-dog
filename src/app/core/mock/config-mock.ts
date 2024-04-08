import {
  ConfigData,
  ExecutionSideInfo,
  ProjectInfo,
  SimulatorInfo,
} from '../interface/config-type';

export const simulatorType = ['安卓', '其他'];

export const defaultConfigData: ConfigData = {
  version: '1.2',
};
// 执行端
export const defaultExecutionSideInfo: ExecutionSideInfo = {
  ipPort: 'http://127.0.0.1:8888',
};
// 模拟器
export const defaultSimulatorInfo: SimulatorInfo = {
  name: '模拟器1',
  type: '安卓',
  ipPort: '127.0.0.1:5555',
};
// 项目名
export const defaultProjectData: ProjectInfo = {
  name: '项目1',
  executionSideInfo: undefined,
  simulatorInfo: undefined,
};
