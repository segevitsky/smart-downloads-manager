// src/components/SearchBar/index.tsx
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange
}) => {
  const filters = [
    { value: 'all', label: 'כל הקבצים' },
    { value: 'images', label: '🖼️ תמונות' },
    { value: 'documents', label: '📄 מסמכים' },
    { value: 'spreadsheets', label: '📊 גליונות' },
    { value: 'archives', label: '📦 קבצים דחוסים' },
    { value: 'media', label: '🎥 מדיה' },
    { value: 'other', label: '📎 אחר' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm">
      <div className="flex-1 relative">
        {/* תיבת החיפוש */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חיפוש לפי שם קובץ..."
          className="w-full px-4 py-3 pr-12 rounded-xl 
                     border border-gray-200 
                     focus:outline-none focus:ring-2 
                     focus:ring-blue-500/20 
                     focus:border-blue-500 
                     transition-all
                     placeholder-gray-400"
        />
        {/* אייקון החיפוש */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 
                        text-gray-400 pointer-events-none">
          🔍
        </span>
      </div>

      {/* סלקט הפילטרים */}
      <select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-3 rounded-xl 
                   border border-gray-200 
                   focus:outline-none focus:ring-2 
                   focus:ring-blue-500/20 
                   focus:border-blue-500 
                   bg-white transition-all
                   min-w-[180px]
                   cursor-pointer
                   text-black
                   hover:border-gray-300"
      >
        {filters.map(filter => (
          <option key={filter.value} value={filter.value} 
                  className="py-2">
            {filter.label}
          </option>
        ))}
      </select>

      {/* כפתור ניקוי */}
      {(searchTerm || filterType !== 'all') && (
        <button 
          onClick={() => {
            onSearchChange('');
            onFilterChange('all');
          }}
          className="px-4 py-3 text-sm text-gray-600 
                     hover:text-gray-800
                     bg-gray-50 hover:bg-gray-100 
                     rounded-xl transition-colors
                     border border-gray-200
                     flex items-center gap-2"
        >
          <span>נקה סינון</span>
          <span>×</span>
        </button>
      )}
    </div>
  );
};