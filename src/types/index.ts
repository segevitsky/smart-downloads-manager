// src/types/index.ts
export interface Download {
    id: number;
    filename: string;
    fileSize?: number;
    startTime: string;
    url: string;
    state: string;
    mime?: string;
  }
  
  export type ViewType = 'grid' | 'list';