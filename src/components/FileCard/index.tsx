// src/components/FileCard/index.tsx
import { useState, useEffect } from "react";
import { Download, Tag, ViewType } from "../../types";
import { formatFileSize, getFileIcon, getMimeType } from "../../utils";
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
  const [fileTag, setFileTag] = useState<Tag[]>([]);
  const { allTags } = useTags();

  const loadFileTag = async () => {
    const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
    const fileTagId = fileTags[file.id]?.[0]; // לוקח את התגית הראשונה
    if (fileTagId) {
      const tag = allTags.find((t) => t.id === fileTagId);
      setFileTag(tag ? [tag] : []);
    }
  };

  useEffect(() => {
    loadFileTag();
  }, [file.id, allTags]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
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
    // במקום להשתמש בנתיב המלא, נקח רק את שם הקובץ
    const fileName = file.filename.split("\\").pop()?.split("/").pop() || "";

    e.dataTransfer.effectAllowed = "copy";

    try {
      // שליחת רק שם הקובץ בתור טקסט
      e.dataTransfer.setData("text/plain", fileName);

      // אם יש לנו URL מקורי של הקובץ
      if (file.url) {
        e.dataTransfer.setData("text/uri-list", file.url);
        e.dataTransfer.setData(
          "DownloadURL",
          `${getMimeType(fileName)}:${fileName}:${file.url}`
        );
      }
    } catch (error) {
      console.error("Error setting data transfer:", error);
    }

    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragging");
  };

  const splittedFilename = file.filename.split("/");
  const completeFilename = splittedFilename[splittedFilename.length - 1];
  const filenameOnly = completeFilename.split("\\").pop();

  return (
    <>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
        className={`relative
      bg-white rounded-xl p-4 
      border border-gray-100
      shadow-sm hover:shadow-md
      transition-all duration-200 ease-in-out
      hover:border-blue-100 hover:scale-[1.02]
      ${fileTag ? "border-2" : "border"}
      ${viewType === "list" ? "flex items-center gap-4" : "flex flex-col"}
    `}
      >
        <div className="rounded-lg bg-blue-50 p-4 text-3xl flex items-center justify-center">
          {getFileIcon(file.filename)}
        </div>

        <div className="flex-1 min-w-0 mt-3">
          <label> שם הקובץ: </label>
          {fileTag.length > 0 && <div>תגית: {fileTag[0].label}</div>}
          <span> {filenameOnly} </span>
          <h3
            className="font-medium truncate text-gray-800"
            dir="ltr"
            title={file.filename}
          >
            {file.filename.split("/").pop()}
          </h3>

          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{formatFileSize(file.fileSize)}</span>
            <span>•</span>
            <span>{new Date(file.startTime).toLocaleDateString("he-IL")}</span>
          </div>
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
          onClose={() => {
            setShowContextMenu(false);
            loadFileTag(); // מרענן את התגית אחרי סגירת התפריט
          }}
        />
      )}
    </>
  );
};
