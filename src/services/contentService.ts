import { siteContent } from '../mocks/siteContent';
import type { SiteContent } from '../types/siteContent';

const STORAGE_KEY = 'portfolio_site_content';
const VERSION_KEY = 'portfolio_content_version';
const CURRENT_VERSION = '1.1';

/**
 * Content Service
 * Manages site content with localStorage persistence
 * Provides mock API layer for future backend integration
 */

export const contentService = {
  /**
   * Load content from localStorage or return defaults
   */
  loadContent(): SiteContent {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const version = localStorage.getItem(VERSION_KEY);

      // If no stored content or version mismatch, return defaults
      if (!stored || version !== CURRENT_VERSION) {
        console.log('Loading default content');
        return siteContent;
      }

      const parsed = JSON.parse(stored);
      console.log('Loaded content from localStorage');
      return parsed;
    } catch (error) {
      console.error('Error loading content:', error);
      return siteContent;
    }
  },

  /**
   * Save content to localStorage
   */
  saveContent(content: SiteContent): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        console.log('Content saved to localStorage');
        resolve();
      } catch (error) {
        console.error('Error saving content:', error);
        reject(error);
      }
    });
  },

  /**
   * Update partial content (merge with existing)
   */
  async updateContent(updates: Partial<SiteContent>): Promise<SiteContent> {
    const current = this.loadContent();
    const updated = { ...current, ...updates };
    await this.saveContent(updated);
    return updated;
  },

  /**
   * Reset content to defaults
   */
  async resetContent(): Promise<SiteContent> {
    await this.saveContent(siteContent);
    return siteContent;
  },

  /**
   * Export content as JSON file
   */
  exportContent(): void {
    const content = this.loadContent();
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Import content from JSON file
   */
  importContent(file: File): Promise<SiteContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          await this.saveContent(content);
          resolve(content);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  /**
   * Check if content has been modified from defaults
   */
  isModified(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null;
  },

  /**
   * Get content version
   */
  getVersion(): string {
    return localStorage.getItem(VERSION_KEY) || 'default';
  }
};

// Mock API layer for future backend integration
export const apiService = {
  /**
   * Fetch content from API (currently uses localStorage)
   */
  async fetchContent(): Promise<SiteContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return contentService.loadContent();
  },

  /**
   * Update content via API (currently uses localStorage)
   */
  async updateContent(updates: Partial<SiteContent>): Promise<SiteContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return contentService.updateContent(updates);
  },

  /**
   * Delete project via API
   */
  async deleteProject(projectId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const content = contentService.loadContent();
    const updated = {
      ...content,
      projects: content.projects.filter(p => p.id !== projectId)
    };
    await contentService.saveContent(updated);
  }
};
