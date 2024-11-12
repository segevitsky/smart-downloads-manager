// src/components/FileCard/index.tsx
import { useState, useEffect } from "react";
import { Download, ViewType } from "../../types";
import { formatFileSize, getFileIcon } from "../../utils";
import { ContextMenu } from "../ContextMenu";
import { useTags } from "../../hooks/useTags";

interface FileCardProps {
  file: Download;
  viewType: ViewType;
}

export const FileCard = ({ file, viewType }: FileCardProps) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [fileTags, setFileTags] = useState<string[]>([]);
  const { allTags } = useTags();

  // טעינת תגיות הקובץ בטעינה ראשונית
  useEffect(() => {
    const loadFileTags = async () => {
      const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
      setFileTags(fileTags[file.id] || []);
    };
    loadFileTags();
  }, [file.id]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleTagsUpdate = (newTags: string[]) => {
    setFileTags(newTags);
  };

  const handleOpen = () => {
    if (chrome.downloads) {
      chrome.downloads.open(file.id);
    }
  };

  const handleShowInFolder = () => {
    if (chrome.downloads) {
      chrome.downloads.show(file.id);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const fileName = file.filename.split('\\').pop()?.split('/').pop() || '';
    
    try {
        if (file.url && file.mime) {
            // שימוש ישיר ב-base64 URL
            const downloadString = `${file.mime}:${fileName}:${file.url}`;
            
            e.dataTransfer.effectAllowed = 'copy';
            // קודם נגדיר את ה-DownloadURL
            e.dataTransfer.setData('DownloadURL', downloadString);
            e.dataTransfer.setData('text/plain', fileName);

            console.log('Drag data:', { downloadString, fileName, url: file.url });
        } else {
            e.dataTransfer.setData('text/plain', fileName);
        }
    } catch (error) {
        console.error('Error during drag:', error);
        e.dataTransfer.setData('text/plain', fileName);
    }

    e.currentTarget.classList.add('dragging');
};

const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
};

  const splittedFilename = file.filename.split("/");
  const completeFilename = splittedFilename[splittedFilename.length - 1];
  const filenameOnly = completeFilename.split("\\").pop();

  // הצגת התגיות
  const renderTags = () => {
    return fileTags.map((tagId) => {
      const tag = allTags.find((t) => t.id === tagId);
      if (!tag) return null;
      return (
        <span
          key={tag.id}
          className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full mr-1"
        >
          {tag.label}
        </span>
      );
    });
  };

  return (
    <>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
        className={`
         relative
         bg-white rounded-xl p-4 
         border border-gray-100
         shadow-sm hover:shadow-md
         transition-all duration-200 ease-in-out
         hover:border-blue-100 hover:scale-[1.02]
         cursor-pointer
         ${viewType === "list" ? "flex items-center gap-4" : "flex flex-col"}
       `}
      >
        <div className="rounded-lg bg-blue-50 p-4 text-3xl flex items-center justify-center">
          {getFileIcon(file.filename)}
        </div>

        <div className="flex-1 min-w-0 mt-3">
          <div
            className="font-medium truncate text-gray-800"
            dir="ltr"
            title={file.filename}
          >
            {filenameOnly}
          </div>

          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{formatFileSize(file.fileSize)}</span>
            <span>•</span>
            <span>{new Date(file.startTime).toLocaleDateString("he-IL")}</span>
          </div>

          {/* תגיות */}
          {fileTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">{renderTags()}</div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleOpen}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 
                    rounded-lg hover:bg-blue-600 transition-colors"
          >
            פתח
          </button>
          <button
            onClick={handleShowInFolder}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
                    rounded-lg hover:bg-blue-100 transition-colors"
          >
            הצג בתיקייה
          </button>
        </div>
      </div>

      {showContextMenu && (
        <ContextMenu
          fileId={JSON.stringify(file.id)}
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
          onTagsUpdate={handleTagsUpdate}
        />
      )}
    </>
  );
};
