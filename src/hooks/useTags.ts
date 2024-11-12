// src/hooks/useTags.ts
import { useState, useEffect } from "react";
import { DEFAULT_TAGS, Tag } from "../types";

// src/hooks/useTags.ts
export const useTags = () => {
  const [allTags, setAllTags] = useState<Tag[]>([]);


    // טעינת תגיות בהתחלה
    const loadTags = async () => {
      const { customTags = [] } = await chrome.storage.sync.get('customTags');
      setAllTags([...DEFAULT_TAGS, ...customTags]);
    };


  // טעינת תגיות בהתחלה
  useEffect(() => {
    loadTags();
    
    // האזנה לשינויים בסטורג'
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.customTags) {
        loadTags();  // טעינה מחדש של התגיות
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // תיוג קובץ - עכשיו מקבל מערך של תגיות
  const tagFile = async (fileId: string, tagId: string) => {
    const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
    fileTags[fileId] = fileTags[fileId] || [];

    // אם התגית לא קיימת, מוסיף אותה
    if (!fileTags[fileId].includes(tagId)) {
      fileTags[fileId].push(tagId);
      await chrome.storage.sync.set({ fileTags });
    }
  };

  // הסרת תגית מקובץ
  const removeTagFromFile = async (fileId: string, tagId: string) => {
    const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
    if (fileTags[fileId]) {
      fileTags[fileId] = fileTags[fileId].filter((id: string) => id !== tagId);
      await chrome.storage.sync.set({ fileTags });
    }
  };

  // הוספת תגית חדשה
  const addCustomTag = async (label: string) => {
    const newTag: Tag = {
      id: `custom-${Date.now()}`,
      label,
      isCustom: true
    };
    
    const { customTags = [] } = await chrome.storage.sync.get('customTags');
    const updatedTags = [...customTags, newTag];
    await chrome.storage.sync.set({ customTags: updatedTags });
    
    // עדכון מיידי של הסטייט
    setAllTags(prev => [...prev, newTag]);
    
    return newTag;
  };
  
  
  // מחיקת תגית מותאמת אישית
  const deleteCustomTag = async (tagId: string) => {
    const { customTags = [] } = await chrome.storage.sync.get("customTags");
    const updatedTags = customTags.filter(
      (tag: { id: number | string }) => tag.id !== tagId
    );
    await chrome.storage.sync.set({ customTags: updatedTags });

    // מחיקת התגית מכל הקבצים שמשתמשים בה
    const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
    for (const fileId in fileTags) {
      fileTags[fileId] = fileTags[fileId].filter((id: string) => id !== tagId);
    }
    await chrome.storage.sync.set({ fileTags });

    setAllTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  return {
    allTags,
    tagFile,
    removeTagFromFile,
    addCustomTag,
    deleteCustomTag,
  };
};