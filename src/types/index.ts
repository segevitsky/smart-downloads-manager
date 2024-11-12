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

export type ViewType = "grid" | "list";

export interface Tag {
  id: string;
  label: string;
  color?: string;
  isCustom?: boolean;
}

export const DEFAULT_TAGS: Tag[] = [
  { id: "important", label: "חשוב!", color: "#ef4444" },
  { id: "todo", label: "לטיפול", color: "#f97316" },
  { id: "read-later", label: "לקרוא אחר כך", color: "#3b82f6" },
  { id: "share", label: "לשיתוף", color: "#22c55e" },
];
