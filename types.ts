
export type MessageType = 'text' | 'style-selection' | 'image-gallery' | 'comparison' | 'product-list';
export type DesignMode = 'interior' | 'exterior' | 'landscape';
export type InputType = 'photo' | 'sketch';

export interface Product {
  id: string;
  x: number;
  y: number;
  name: string;
  price: string;
  image: string;
  link: string;
}

export interface DesignResult {
  original: string;
  modified: string;
  products?: Product[];
}

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  prompt: string;
}

export interface Attachment {
  id: string;
  url: string;
  type: 'image' | 'drawing';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: MessageType;
  content: string;
  timestamp: Date;
  data?: any;
  attachments?: Attachment[];
  groundingUrls?: { title: string; uri: string }[];
}

export interface GroundingMetadata {
  groundingChunks?: {
    web?: {
      uri: string;
      title: string;
    }
  }[];
}
