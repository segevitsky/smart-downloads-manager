// src/hooks/useTags.ts
import { useState, useEffect } from "react";
import { DEFAULT_TAGS, Tag } from "../types";

// src/hooks/useTags.ts
export const useTags = () => {
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // טעינת תגיות בהתחלה
  useEffect(() => {
    const loadTags = async () => {
      const { customTags = [] } = await chrome.storage.sync.get("customTags");
      setAllTags([...DEFAULT_TAGS, ...customTags]);
    };
    loadTags();
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
      isCustom: true,
    };

    const { customTags = [] } = await chrome.storage.sync.get("customTags");
    const updatedTags = [...customTags, newTag];
    await chrome.storage.sync.set({ customTags: updatedTags });
    setAllTags((prev) => [...prev, newTag]); // עדכון מיידי של הסטייט
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

// export const useTags = () => {
//   const [allTags, setAllTags] = useState<Tag[]>([...DEFAULT_TAGS]); // שינוי כאן
//   const [customTags, setCustomTags] = useState<Tag[]>([]);

//   useEffect(() => {
//     chrome.storage.sync.get("customTags").then((result) => {
//       if (result.customTags) {
//         setCustomTags(result.customTags);
//         setAllTags([...DEFAULT_TAGS, ...result.customTags]); // עדכון כל התגיות
//       }
//     });
//   }, []);

//   const tagFile = async (fileId: string, tagId: string) => {
//     const { fileTags = {} } = await chrome.storage.sync.get("fileTags");
//     fileTags[fileId] = fileTags[fileId] || [];
//     if (!fileTags[fileId].includes(tagId)) {
//       fileTags[fileId].push(tagId);
//       await chrome.storage.sync.set({ fileTags });
//     }
//   };

//   const addCustomTag = async (label: string) => {
//     const newTag: Tag = {
//       id: `custom-${Date.now()}`,
//       label,
//       isCustom: true,
//     };

//     const updatedCustomTags = [...customTags, newTag];
//     setCustomTags(updatedCustomTags);
//     setAllTags([...DEFAULT_TAGS, ...updatedCustomTags]); // עדכון כל התגיות
//     await chrome.storage.sync.set({ customTags: updatedCustomTags });
//     return newTag;
//   };

//   return {
//     allTags, // עכשיו מחזירים את המערך
//     tagFile,
//     addCustomTag,
//   };
// };
