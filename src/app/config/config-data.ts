export interface ConfigData {
  id?: number;
  // 版本信息
  version: string;
  // 修改的时间
  updateTime?: Date;
  // 记录创建的时间
  createTime?: Date;
}

// “执行”侧信息
export interface ExecutionSideInfo {
  id?: number;
  ipPort: string;
  // 修改的时间
  updateTime?: Date;
  // 记录创建的时间
  createTime?: Date;
}

// 模拟器信息
export interface SimulatorInfo {
  id?: number;
  name: string;
  type: string;
  ipPort: string;
  // 修改的时间
  updateTime?: Date;
  // 记录创建的时间
  createTime?: Date;
}


export interface ProjectInfo {
  id?: number;
  name: string;
  executionSideInfo: ExecutionSideInfo;
  simulatorInfo: SimulatorInfo;
  // 修改的时间
  updateTime?: Date;
  // 记录创建的时间
  createTime?: Date;
}
