// src/hooks/useDownloads.ts
import { useState, useEffect } from 'react';
import { Download } from '../types';

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        if (chrome.downloads) {
          const items = await chrome.downloads.search({
            orderBy: ['-startTime'],
            limit: 50
          });
          setDownloads(items);
        } else {
          // מידע לפיתוח לוקלי
          setDownloads([
            {
              id: 1,
              filename: "מסמך לדוגמה.pdf",
              fileSize: 1024576,
              startTime: new Date().toISOString(),
              url: "https://example.com/doc.pdf",
              state: "complete"
            },
            // עוד דוגמאות...
          ]);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadDownloads();
  }, []);

  return { downloads, loading, error };
};