import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { ITEMS } from '../data/mockItems';
import type { ResourceItem } from '../types';

export const isDevModeAtom = atomWithStorage('devMode', false);

export const liveItemsAtom = atom<ResourceItem[]>([]);

export const activeItemsAtom = atom<ResourceItem[]>((get) => {
    return get(isDevModeAtom) ? ITEMS : get(liveItemsAtom);
});
export const refreshAtom = atom(0);
