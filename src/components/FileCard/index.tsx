// src/components/FileCard/index.tsx
import { Download, ViewType } from "../../types";
import { formatFileSize, getFileIcon } from "../../utils";

interface FileCardProps {
  file: Download;
  viewType: ViewType;
}

export const FileCard = ({ file, viewType }: FileCardProps) => {
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

  return (
    <div
      className={`
      bg-white rounded-xl p-4 
      border border-gray-100
      shadow-sm hover:shadow-md
      transition-all duration-200 ease-in-out
      hover:border-blue-100 hover:scale-[1.02]
      ${viewType === "list" ? "flex items-center gap-4" : "flex flex-col"}
    `}
    >
      <div className="rounded-lg bg-blue-50 p-4 text-3xl flex items-center justify-center">
        {getFileIcon(file.filename)}
      </div>

      <div className="flex-1 min-w-0 mt-3">
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
  );
};
