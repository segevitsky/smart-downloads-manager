// src/hooks/useTags.ts
import { useState, useEffect } from "react";
import { DEFAULT_TAGS, Tag } from "../types";

export const useTags = () => {
  const [allTags, setAllTags] = useState<Tag[]>([...DEFAULT_TAGS]); // שינוי כאן
  const [customTags, setCustomTags] = useState<Tag[]>([]);

  useEffect(() => {
    chrome.storage.sync.get("customTags").then((result) => {
      if (result.customTags) {
        setCustomTags(result.customTags);
        setAllTags([...DEFAULT_TAGS, ...result.customTags]); // עדכון כל התגיות
      }
    });
  }, []);

  const tagFile = async (fileId: string, tagId: string) => {
    const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
    fileTags[fileId] = fileTags[fileId] || [];
    if (!fileTags[fileId].includes(tagId)) {
      fileTags[fileId].push(tagId);
      await chrome.storage.sync.set({ fileTags });
    }
  };

  const addCustomTag = async (label: string) => {
    const newTag: Tag = {
      id: `custom-${Date.now()}`,
      label,
      isCustom: true,
    };

    const updatedCustomTags = [...customTags, newTag];
    setCustomTags(updatedCustomTags);
    setAllTags([...DEFAULT_TAGS, ...updatedCustomTags]); // עדכון כל התגיות
    await chrome.storage.sync.set({ customTags: updatedCustomTags });
    return newTag;
  };

  return {
    allTags, // עכשיו מחזירים את המערך
    tagFile,
    addCustomTag,
  };
};
