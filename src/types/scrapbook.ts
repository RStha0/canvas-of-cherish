
export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  STICKER = 'sticker',
  DRAWING = 'drawing',
  AUDIO = 'audio'
}

export interface TextElementData {
  content: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontStyle?: string;
}

export interface ImageElementData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  rotation?: number;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

export interface StickerElementData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface DrawingElementData {
  paths: Array<{
    points: Array<[number, number]>;
    color: string;
    width: number;
  }>;
  width: number;
  height: number;
}

export interface AudioElementData {
  src: string;
  title?: string;
  duration?: number;
}

export type ElementData = 
  | TextElementData 
  | ImageElementData 
  | StickerElementData 
  | DrawingElementData 
  | AudioElementData;

export interface ScrapbookElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  zIndex: number;
  data: ElementData;
}

export interface ScrapbookPage {
  id: string;
  title: string;
  background: string;
  elements: ScrapbookElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Scrapbook {
  id: string;
  title: string;
  coverImage?: string;
  pages: ScrapbookPage[];
  createdAt: Date;
  updatedAt: Date;
}
