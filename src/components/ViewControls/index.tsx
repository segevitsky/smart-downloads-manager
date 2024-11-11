// src/components/ViewControls/index.tsx
import { ViewType } from '../../types';

interface ViewControlsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewControls = ({ currentView, onViewChange }: ViewControlsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded ${
          currentView === 'grid' 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <GridIcon />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded ${
          currentView === 'list' 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <ListIcon />
      </button>
    </div>
  );
};

const GridIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>
  </svg>
);