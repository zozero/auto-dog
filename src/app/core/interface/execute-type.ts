export interface TaskExecuteInfo {
    id?: number;
    // 任务名
    name: string;
    // 项目名
    projectName: string;
    // 执行日，每周几执行，每月几号执行
    executionDay: number;
    // 周期，每天，每周，每月，临时
    periodic: string
    // 排序
    sort: number;
    // 修改的时间
    updateTime?: Date;
    // 记录创建的时间
    createTime?: Date;
}

// 执行的结果信息，就是把今日需要执行的重新加入到这个表中
export interface TaskExecuteResultInfo { 
    id?: number;
    // 执行所需要信息
    executeInfo: TaskExecuteInfo;
    // 项目名
    projectName: string;
    // 开始时间
    start?: Date;
    // 结束时间
    end?: Date;
    // 执行状态，未预期；未执行；执行中；已执行；已过期
    status: string;
    // 修改的时间
    updateTime?: Date;
    // 记录创建的时间
    createTime?: Date;
}

export interface MyDragDropType {
    // 执行信息类，暂时添加string
    数据: TaskExecuteInfo ;
    // 用于删除列表中指定索引的数据
    原索引?: number;
    // 选中的状态，用于多选拖拽
    选中?: boolean;
    // 放置在什么类型上，是天，还是周，还是月
    类型?: string ;
}

export interface TaskStoreState{
    projectName:string;
    // 任务结果列表
    taskResultList:TaskExecuteResultInfo[];
}