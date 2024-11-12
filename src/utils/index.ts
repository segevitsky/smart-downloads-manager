// src/utils/index.ts
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export const getFileIcon = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const icons: Record<string, string> = {
    pdf: "📄",
    doc: "📄",
    docx: "📄",
    xls: "📊",
    xlsx: "📊",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    zip: "📦",
    rar: "📦",
    mp3: "🎵",
    mp4: "🎥",
    // הוסף עוד אייקונים לפי הצורך
  };

  return icons[ext || ""] || "📄";
};

export const getFileType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const typeMap: Record<string, string[]> = {
    images: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
    documents: ["pdf", "doc", "docx", "txt", "rtf"],
    spreadsheets: ["xls", "xlsx", "csv"],
    archives: ["zip", "rar", "7z", "tar", "gz"],
    media: ["mp3", "mp4", "wav", "avi", "mov", "mkv"],
  };

  for (const [type, extensions] of Object.entries(typeMap)) {
    if (extensions.includes(ext)) return type;
  }

  return "other";
};

export const getMimeType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    console.log("Getting mime type for extension:", ext);

    const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'txt': 'text/plain',
        'csv': 'text/csv',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed'
    };

    const mimeType = mimeTypes[ext || ''] || 'application/octet-stream';
    console.log("Determined mime type:", mimeType);
    return mimeType;
};
