export interface CropImageInfo {
  url: string;
  blob: Blob;
  info: imageInfo;
  rowImageInfo: RowImageInfo;
}

export interface RowImageInfo {
  width: number;
  height: number;
}

export interface imageInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}
