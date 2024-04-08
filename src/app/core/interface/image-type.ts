export interface CropImageInfo {
  url: string;
  blob: Blob;
  info: ImageInfo;
  rowImageInfo: RowImageInfo;
  // 专用于人工智能算法yolo的参数
  cropArgs?:UploadCropArgs;
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
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
}

// 用于上传的裁剪过的参数，专用于人工智能算法yolo
export interface UploadCropArgs{
  分类?:string;
  比例中心点:number[];
  比例尺寸:number[];
}

export interface ScreenshotInfo{
  url: string;
  blob: Blob;
  width:number;
  height:number;
  cropImageInfos:CropImageInfo[];
}
