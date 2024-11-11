// src/App.tsx
import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ViewControls } from './components/ViewControls';
import { FileCard } from './components/FileCard';
import { useDownloads } from './hooks/useDownloads';
import { ViewType } from './types';
import { getFileType } from './utils';

function App() {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const { downloads, loading, error } = useDownloads();

  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || getFileType(download.filename) === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return <div>טוען...</div>;
  if (error) return <div>שגיאה: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            ההורדות שלי
          </h1>
          <ViewControls 
            currentView={viewType} 
            onViewChange={setViewType} 
          />
        </header>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        <div className={`
          ${viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }
        `}>
          {filteredDownloads.map(file => (
            <FileCard 
              key={file.id}
              file={file}
              viewType={viewType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;