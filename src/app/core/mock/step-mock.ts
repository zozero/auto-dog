import { StepTableType } from "../interface/table-type";
import { matchMethodList } from "./match-mock";



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

  
export const defaultBehaviorEncode=['A','B']
export const defaultDirectionEncode=['X','Y']

export const defaultZJEncode=['Z','J']