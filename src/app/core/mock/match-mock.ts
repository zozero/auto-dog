import {
  BinaryImageMatchMethodType,
  ImageMatchMethodType,
  MatchAndMatchMethodType,
  MatchMethodType,
  MultiImageMatchMethodType,
  NoImageMatchMethodType,
  YOLOMatchMethodType,
} from '../interface/table-type';

export const defaultImageMatchMethodArgs: ImageMatchMethodType = {
  图片名: '',
  范围: '',
  算法: 5,
  最低相似度: 0.8,
  额外补充: 0,
};

export const defaultBinaryImageMatchMethodArgs: BinaryImageMatchMethodType = {
  图片名: '',
  范围: '',
  阈值: 200,
  阈值类型: 0,
  算法: 5,
  最低相似度: 0.8,
};

export const defaultMatchAndMatchMethodArgs: MatchAndMatchMethodType = {
  前编码: '',
  后编码: '',
  X偏移: 0,
  Y偏移: 0,
};

export const defaultNoImageMatchMethodArgs: NoImageMatchMethodType = {
  图片名: '',
  X轴: 0,
  Y轴: 0,
};

export const defaulmultitImageMatchMethodArgs: MultiImageMatchMethodType = {
  图片名: '',
  范围: '0 0 1.0 1.0',
  算法: 5,
  最低相似度: 0.8,
  额外补充: 0,
};


export const defaulYoloMatchMethodArgs: YOLOMatchMethodType = {
  分类: '',
  轮回数: 160,
  置信度: 0.2
};


// 参数无法对应，所以需要额外增加列表
export const matchMethodTotalList: MatchMethodType[] = [
  {
    编码: 'A',
    名称: '图片匹配',
  },
  {
    编码: 'B',
    名称: '二值图片匹配',
  },
  {
    编码: 'C',
    名称: '匹配再匹配',
  },
  {
    编码: 'D',
    名称: '无图匹配',
  },
  {
    编码: 'E',
    名称: '多图匹配',
  },
  {
    编码: 'F',
    名称: '你只看一次',
  },
];

// 裁剪图片匹配方法列表
export const cropMatchMethodList: MatchMethodType[] = [
  {
    编码: 'A',
    名称: '图片匹配',
  },
  {
    编码: 'B',
    名称: '二值图片匹配',
  },
  {
    编码: 'D',
    名称: '无图匹配',
  },
];

// 参数无法对应，所以需要额外增加列表
// 多图匹配方法列表
export const multiImageMatchMethodList: MatchMethodType[] = [
  {
    编码: 'E',
    名称: '多图匹配',
  },
  {
    编码: 'F',
    名称: '你只看一次',
  },
];
