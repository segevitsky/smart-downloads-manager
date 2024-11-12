// src/components/ContextMenu/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTags } from "../../hooks/useTags";

interface ContextMenuProps {
  fileId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onTagsUpdate: (tags: string[]) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  fileId,
  position,
  onClose,
  onTagsUpdate,
}) => {
  const { allTags, tagFile, removeTagFromFile, deleteCustomTag, addCustomTag } =
    useTags();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // טעינת התגיות הנוכחיות של הקובץ
  useEffect(() => {
    const loadCurrentTags = async () => {
      const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
      setSelectedTags(fileTags[fileId] || []);
    };
    loadCurrentTags();
  }, [fileId]);

  const handleTagToggle = async (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      await removeTagFromFile(fileId, tagId);
      const newTags = selectedTags.filter((id) => id !== tagId);
      setSelectedTags(newTags);
      onTagsUpdate(newTags);
    } else {
      await tagFile(fileId, tagId);
      const newTags = [...selectedTags, tagId];
      setSelectedTags(newTags);
      onTagsUpdate(newTags);
    }
  };

  const handleCustomTagSubmit = async () => {
    if (customTagInput.trim()) {
      const newTag = await addCustomTag(customTagInput.trim());
      await tagFile(fileId, newTag.id);
      const newTags = [...selectedTags, newTag.id];
      setSelectedTags(newTags);
      onTagsUpdate(newTags);
      setCustomTagInput("");
      setIsAddingCustom(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    await deleteCustomTag(tagId);
    const newTags = selectedTags.filter((id) => id !== tagId);
    setSelectedTags(newTags);
    onTagsUpdate(newTags);
  };

  const handleSave = () => {
    onTagsUpdate(selectedTags);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border p-2 min-w-[200px] z-50"
      style={{ top: position.y, left: position.x }}
    >
      <div className="space-y-1">
        {allTags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between">
            <button
              onClick={() => handleTagToggle(tag.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${
                selectedTags.includes(tag.id)
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-4 h-4 border rounded flex items-center justify-center ${
                  selectedTags.includes(tag.id)
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {selectedTags.includes(tag.id) && "✓"}
              </span>
              {tag.label}
            </button>

            {tag.isCustom && (
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-lg ml-2"
                title="מחק תגית"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t my-2" />

      {isAddingCustom ? (
        <div className="px-2 py-2 flex gap-2">
          <input
            autoFocus
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="הקלד תגית חדשה..."
            className="flex-1 px-2 py-1 border rounded"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCustomTagSubmit();
              } else if (e.key === "Escape") {
                setIsAddingCustom(false);
              }
            }}
          />
          <button
            onClick={handleCustomTagSubmit}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            הוסף
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCustom(true)}
          className="w-full px-3 py-2 text-right hover:bg-gray-50 text-blue-600 rounded-lg"
        >
          + תגית חדשה
        </button>
      )}

      {/* כפתורי פעולה */}
      <div className="border-t mt-2 pt-2 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          הוסף
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ביטול
        </button>
      </div>
    </div>
  );
};
