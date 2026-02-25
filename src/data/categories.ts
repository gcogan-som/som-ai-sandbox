import type { CategoryName, SortOption } from '../types';

export const CATEGORIES: Array<'All' | CategoryName> = [
    'All', 'Gems', 'Prompts', 'AI Studio', 'Krea', 'Notebooks', 'Workflows',
];

export const SORT_OPTIONS: SortOption[] = ['Trending', 'Newest', 'Top Rated', 'Most Used'];

export const COLORS: Record<CategoryName, string> = {
    Gems: '#D4845A',
    Prompts: '#6AADCF',
    'AI Studio': '#CBAA5E',
    Krea: '#E07BA0',
    Notebooks: '#B494D0',
    Workflows: '#8BC78A',
};

export const CAT_INFO: Record<CategoryName, string> = {
    Gems: 'Custom AI personalities in Google Gemini. A Gem is a reusable set of instructions that makes Gemini an expert on a specific topic — like a colleague who always knows your firm\'s design language or zoning codes.',
    Prompts: 'Carefully crafted text instructions for AI models. A good prompt turns a general-purpose AI into a specialist. Copy-paste ready templates for Gemini, AI Studio, or any AI tool.',
    'AI Studio': 'Configured sessions in Google AI Studio with specific model settings, tools, and grounding. More powerful than a prompt — full pipelines that process files, generate structured outputs, and chain steps.',
    Krea: 'AI image generation presets and workflows in Krea. Style configurations, reference image setups, and proven workflows for architectural visualization and presentation graphics.',
    Notebooks: 'Curated knowledge collections in Google NotebookLM. Upload documents and NotebookLM becomes an expert — generating summaries, answering questions, and creating audio overviews.',
    Workflows: 'Step-by-step descriptions of how someone uses AI in their daily work. Not a single tool, but a process — like how you chain Gemini research into a Krea render into a presentation. Share what works for you.',
};
