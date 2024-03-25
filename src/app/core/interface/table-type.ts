export interface ImageMatchMethodType {
  序号?: number;
  图片名: string;
  范围: string;
  算法: number;
  最低相似度: number;
  额外补充: number;
}

export interface MatchMethodType {
  编码: string;
  名称: string;
  // 参数: ImageMatchMethodType | BinaryImageMatchMethodType;
}

export interface BinaryImageMatchMethodType {
  序号?: number;
  图片名: string;
  范围: string;
  阈值: number;
  阈值类型: number;
  算法: number;
  最低相似度: number;
}

export interface ImageArgType {
  参数名: string;
  参数值: string | number;
}

export interface StepTableType {
  序号?: number;
  名称: string;
  界面编码: string;
  方法编码: string;
  行为编码: string;
  动后编码: string;
  循环次数: number;
  循环间隔: number;
}



export interface TestStepDataType {
  模拟器的ip和端口: string;
  项目名: string;
  名称: string;
  编号: number;
}


export interface TaskTableType {
  序号?: number;
  名称: string;
  编号: number;
  是: number;
  否: number;
}

export interface TestTaskDataType {
  模拟器的ip和端口: string;
  项目名: string;
  任务名: string;
}