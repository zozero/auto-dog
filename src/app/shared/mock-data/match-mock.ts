export const imageMatchMethodArgList = [
  {
    参数名: '序号',
    默认值: '',
  },
  {
    参数名: '图片名',
    默认值: '',
  },
  {
    参数名: '范围',
    默认值: '',
  },
  {
    参数名: '算法',
    默认值: 5,
  },
  {
    参数名: '最低相似度',
    默认值: 0.8,
  },
  {
    参数名: '额外补充',
    默认值: 0,
  },
];

export const matchMethodList = [
  {
    编码: 'A',
    名称: '图片匹配',
    参数列表: imageMatchMethodArgList,
  },
  {
    编码: 'B',
    名称: '图片二值化匹配',
    参数列表: [],
  },
];

export const methodArgType = [
  '序号',
  '图片名',
  '范围',
  '算法',
  '最低相似度',
  '补充判断',
];
