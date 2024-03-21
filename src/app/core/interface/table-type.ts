export interface ImageMatchMethodType {
  序号?: number;
  图片名: string;
  范围: string;
  算法: number;
  最低相似度: number;
  额外补充: number;
}

export interface matchMethodType {
  编码: string;
  名称: string;
  参数:ImageMatchMethodType;
}
