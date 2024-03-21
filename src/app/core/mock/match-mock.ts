import { ImageMatchMethodType, matchMethodType } from '../interface/table-type';

export const defaultImageMatchMethodArgs: ImageMatchMethodType = {
  图片名: '',
  范围: '',
  算法: 5,
  最低相似度: 0.8,
  额外补充: 0,
};



export const matchMethodList: matchMethodType[] = [
  {
    编码: 'A',
    名称: '图片匹配',
    参数:defaultImageMatchMethodArgs
  },
  // {
  //   编码: 'B',
  //   名称: '图片二值化匹配',
  //   参数:undefined
  // },
];
