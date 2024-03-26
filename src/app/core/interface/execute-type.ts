export interface ExecuteInfo {
    id?: number;
    // 任务名
    name: string;
    // 执行日，每周几执行，每月几号执行
    executionDay: number;
    // 周期，每天，每周，每月
    periodic: string
    // 排序
    sort: number;
    // 修改的时间
    updateTime?: Date;
    // 记录创建的时间
    createTime?: Date;
}

// 执行的结果信息，就是把今日需要执行的重新加入到这个表中
export interface ExecuteResultInfo {
    id?: number;
    // 任务名
    name: string;
    // 开始时间
    start?: Date;
    // 结束时间
    end?: Date;
    // 执行状态，-1未预期；0未执行；1已执行
    status: number;
    // 修改的时间
    updateTime?: Date;
    // 记录创建的时间
    createTime?: Date;
}

export interface MyDragDropType {
    对象?: MyDragDropType[];
    // 执行信息类，暂时添加string
    数据?: ExecuteInfo | string;
    // 用于删除列表中指定索引的数据
    原索引: number;
    // 选中的状态，用于多选拖拽
    选中: boolean
}