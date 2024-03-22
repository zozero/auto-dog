import {
  BinaryImageMatchMethodType,
  ImageArgType,
  ImageMatchMethodType,
  MatchMethodType,
} from '../interface/table-type';

export const defaultImageMatchMethodArgs: ImageMatchMethodType = {
  图片名: '',
  范围: '',
  算法: 5,
  最低相似度: 0.8,
  额外补充: 0,
};

export const defaultBinarytImageMatchMethodArgs: BinaryImageMatchMethodType = {
  图片名: '',
  范围: '',
  阈值: 200,
  阈值类型: 0,
  算法: 5,
  最低相似度: 0.8,
};

// 参数无法对应，所以需要额外增加列表
export const matchMethodList: MatchMethodType[] = [
  {
    编码: 'A',
    名称: '图片匹配',
    // 参数: defaultImageMatchMethodArgs,
  },
  {
    编码: 'B',
    名称: '图片二值化匹配',
    // 参数: defaultBinarytImageMatchMethodArgs,
  },
];

export const defaultmethodArgList: ImageArgType[] = [
  {
    参数名: '序号',
    参数值: '',
  },
  {
    参数名: '图片名',
    参数值: '',
  },
  {
    参数名: '范围',
    参数值: '',
  },
  {
    参数名: '算法',
    参数值: 5,
  },
  {
    参数名: '最低相似度',
    参数值: 0.8,
  },
  {
    参数名: '值',
    参数值: 200,
  },
  {
    参数名: '阈值类型',
    参数值: 0,
  },
  {
    参数名: '额外补充',
    参数值: 0,
  },
];
