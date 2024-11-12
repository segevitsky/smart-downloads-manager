// src/components/ContextMenu/index.tsx
import React, { useState } from "react";
import { useTags } from "../../hooks/useTags";

interface ContextMenuProps {
  fileId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  fileId,
  position,
  onClose,
}) => {
  const { allTags, tagFile, addCustomTag } = useTags();
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");

  const handleTagSelect = async (tagId: string) => {
    await tagFile(fileId, tagId);
    onClose();
  };

  const handleCustomTagSubmit = async () => {
    if (customTagInput.trim()) {
      const newTag = await addCustomTag(customTagInput.trim());
      await tagFile(fileId, newTag.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
      style={{ top: position.y, left: position.x }}
    >
      {allTags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagSelect(tag.id)}
          className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2"
        >
          {tag.color && (
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
          )}
          {tag.label}
        </button>
      ))}

      <div className="border-t my-1" />

      {isAddingCustom ? (
        <div className="px-4 py-2 flex gap-2">
          <input
            autoFocus
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="הקלד תגית חדשה..."
            className="flex-1 px-2 py-1 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleCustomTagSubmit()}
          />
          <button
            onClick={handleCustomTagSubmit}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded"
          >
            הוסף
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCustom(true)}
          className="w-full px-4 py-2 text-right hover:bg-gray-50 text-blue-600"
        >
          תגית חדשה...
        </button>
      )}
    </div>
  );
};
