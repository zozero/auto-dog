import { BehaviorEncodeType, StepTableType } from "../interface/table-type";



export const defaultStepData: StepTableType = {
    序号:0,
    名称:'',
    界面编码:'',
    方法编码:'',
    行为编码:'A',
    动后编码:'',
    循环次数:0,
    循环间隔:1.0,
};

// 输入框组合，各种编码，在提交的时候要重新合成数据
export const  defaultEncodeObj={
    界面编码:['',null],
    方法编码:['A',null],
    行为编码:['A',null,''],
    动后编码:['',null,'',null],
  }

  
export const defaultBehaviorEncode:BehaviorEncodeType[]=[
  {
    编码: 'A',
    名称: '点击',
  },
  {
    编码: 'B',
    名称: '滑动',
  },
  {
    编码: 'C',
    名称: '返回',
  },
  {
    编码: 'D',
    名称: '主界面',
  },
  {
    编码: 'E',
    名称: '长按',
  },
]
export const defaultDirectionEncode:BehaviorEncodeType[]=[
  {
    编码: 'X',
    名称: '横轴',
  },
  {
    编码: 'Y',
    名称: '纵轴',
  },
]

export const defaultZJEncode:BehaviorEncodeType[]=[
  {
    编码: 'Z',
    名称: '真则执行',
  },
  {
    编码: 'J',
    名称: '假则执行',
  },
]