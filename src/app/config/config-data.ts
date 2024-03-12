export interface ConfigData {
  id?: number;
  // 版本信息
  version: string;
}

// 模拟器信息
export interface SimulatorInfo {
  id?: number;
  name: string;
  type: string;
  ip: string;
  port: number;
}

// “执行”侧信息
export interface ExecutionSideInfo {
  id?: number;
  ip: string;
  port: number;
}
