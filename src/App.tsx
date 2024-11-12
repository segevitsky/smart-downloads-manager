// src/App.tsx
import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { ViewControls } from "./components/ViewControls";
import { FileCard } from "./components/FileCard";
import { useDownloads } from "./hooks/useDownloads";
import { getFileType } from "./utils";
import { ViewType, Download } from "./types";

function App() {
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredDownloads, setFilteredDownloads] = useState<Download[]>([]);

  const { downloads, loading, error } = useDownloads();

  useEffect(() => {
    const filterDownloads = async () => {
      if (!downloads.length) return;

      let filtered = [...downloads];

      // אם זה סינון לפי תגית
      if (filterType.startsWith("tag:")) {
        const tagId = filterType.replace("tag:", "");
        const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
        filtered = filtered.filter(
          (download) => fileTags[download.id]?.[0] === tagId
        );
      }
      // סינון רגיל לפי סוג קובץ
      else if (filterType !== "all") {
        filtered = filtered.filter(
          (download) => getFileType(download.filename) === filterType
        );
      }

      // סינון לפי טקסט חיפוש
      if (searchTerm) {
        filtered = filtered.filter((download) =>
          download.filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredDownloads(filtered);
    };

    filterDownloads();
  }, [downloads, filterType, searchTerm]);

  if (loading) return <div>טוען...</div>;
  if (error) return <div>שגיאה: {error.message}</div>;

  return (
    <div
      className="w-[800px] h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            ההורדות שלי
          </h1>
          <ViewControls currentView={viewType} onViewChange={setViewType} />
        </header>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        <div
          className={`
          ${
            viewType === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        `}
        >
          {filteredDownloads.map(
            (
              file: Download // מוסיפים את הטיפוס
            ) => (
              <FileCard key={file.id} file={file} viewType={viewType} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
