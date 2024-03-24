import { TaskTableType } from "../interface/table-type";

export const defaultTaskData: TaskTableType = {
  // 必须要有这个，因为后期添加文件的时候会用到
  序号:0,
  名称: '',
  编号: 0,
  是: 0,
  否: -1,
};

