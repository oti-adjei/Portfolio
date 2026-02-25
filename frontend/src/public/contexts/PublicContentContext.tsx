import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteContent as fallbackContent } from "../../mocks/siteContent";
import type { SiteContent } from "../../types/siteContent";
import { fetchPublicContent } from "../services/publicApi";
import { isApiMode, isMockMode } from "../../shared/config/runtime";

interface PublicContentContextType {
  content: SiteContent;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PublicContentContext = createContext<PublicContentContextType | undefined>(undefined);

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(isApiMode());
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (isMockMode()) {
      setContent(fallbackContent);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextContent = await fetchPublicContent();
      setContent(nextContent);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load content";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMockMode()) {
      setContent(fallbackContent);
      setError(null);
      setIsLoading(false);
      return;
    }
    void refresh();
  }, []);

  const value = useMemo(
    () => ({ content, isLoading, error, refresh }),
    [content, isLoading, error]
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

export function usePublicContent() {
  const context = useContext(PublicContentContext);
  if (!context) {
    throw new Error("usePublicContent must be used within PublicContentProvider");
  }
  return context;
}

export const useContent = usePublicContent;
