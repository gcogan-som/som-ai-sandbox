export interface Tip {
  author: string;
  text: string;
  votes: number;
}

export interface ResourceItem {
  id: string | number;
  title: string;
  kind: 'tool' | 'example' | 'guide' | 'workflow' | 'idea';
  category: 'Gems' | 'Prompts' | 'AI Studio' | 'Krea' | 'Notebooks' | 'Workflows' | 'Viz Prompts' | 'Idea';
  discipline: string;
  office: string;
  author: string;
  authorPhotoUrl?: string;
  description: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  userRatings?: Record<string, number>;
  uses: number;
  featured: boolean;
  verified: boolean;
  date: string;
  tips: Tip[];
  primaryLink?: string;
  supportingLinks?: string[];
  supportingFiles?: { name: string; url: string }[];
  prompt?: string;
  targetPlatform?: string;
  aiModel?: string;
  vizImages?: {
    result?: string;
    original?: string;
    style?: string;
  };
  status?: 'Idea' | 'Implemented';
  problemStatement?: string;
  proposedSolution?: string;
}

export interface RequestItem {
  id: string | number;
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
  aiModels: string[];
}
