export interface CropImageInfo {
  url: string;
  blob: Blob;
  info: ImageInfo;
  rowImageInfo: RowImageInfo;
}

export interface RowImageInfo {
  width: number;
  height: number;
}

export interface ImageInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}

