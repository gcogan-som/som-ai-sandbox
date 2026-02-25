export interface Tip {
  author: string;
  text: string;
  votes: number;
}

export interface ResourceItem {
  id: number;
  title: string;
  kind: 'use' | 'learn';
  category: 'Gems' | 'Prompts' | 'AI Studio' | 'Krea' | 'Notebooks' | 'Workflows';
  discipline: string;
  office: string;
  author: string;
  description: string;
  tags: string[];
  rating: number;
  uses: number;
  featured: boolean;
  verified: boolean;
  date: string;
  tips: Tip[];
  primaryLink?: string;
  supportingLinks?: string[];
  supportingFiles?: { name: string; url: string }[];
}

export interface RequestItem {
  id: number;
  title: string;
  category: CategoryName;
  author: string;
  office: string;
  votes: number;
  date: string;
}

export type CategoryName = ResourceItem['category'];
export type SortOption = 'Trending' | 'Newest' | 'Top Rated' | 'Most Used';
export type ViewMode = 'grid' | 'list';

export interface FacetFilters {
  tags: string[];
  offices: string[];
  disciplines: string[];
  authors: string[];
}
