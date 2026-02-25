import { atomWithStorage } from 'jotai/utils';

export const themeModeAtom = atomWithStorage<'light' | 'dark'>('ai-sandbox-theme', 'dark');
