import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { contentService } from '../services/contentService';
import type { SiteContent } from '../types/siteContent';

interface ContentContextType {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => Promise<void>;
  resetContent: () => Promise<void>;
  isLoading: boolean;
  isModified: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(contentService.loadContent());
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState(contentService.isModified());

  // Load content on mount
  useEffect(() => {
    const loadedContent = contentService.loadContent();
    setContent(loadedContent);
    setIsModified(contentService.isModified());
  }, []);

  const updateContent = async (updates: Partial<SiteContent>) => {
    setIsLoading(true);
    try {
      const updated = await contentService.updateContent(updates);
      setContent(updated);
      setIsModified(true);
    } catch (error) {
      console.error('Failed to update content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetContent = async () => {
    setIsLoading(true);
    try {
      const defaultContent = await contentService.resetContent();
      setContent(defaultContent);
      setIsModified(false);
    } catch (error) {
      console.error('Failed to reset content:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, isLoading, isModified }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
