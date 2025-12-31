export interface FavoriteItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  isPinned?: boolean;
  lastVisited?: Date;
  visitCount?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'alphabetical' | 'recent' | 'popular' | 'category';
