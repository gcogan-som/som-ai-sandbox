import { atom } from 'jotai';
import type { ResourceItem, RequestItem } from '../types';
import { REQUESTS_INIT } from '../data/mockRequests';
import { isDevModeAtom } from './appAtoms';

export const selectedItemAtom = atom<ResourceItem | null>(null);
export const editingItemAtom = atom<ResourceItem | null>(null);
export const showSubmitAtom = atom(false);
export const showAboutAtom = atom(false);
export const showReqAtom = atom(false);
export const showFeedbackAtom = atom(false);

export const liveRequestsAtom = atom<RequestItem[]>([]);
const devRequestsAtom = atom<RequestItem[]>(REQUESTS_INIT);

export const requestsAtom = atom(
    (get) => get(isDevModeAtom) ? get(devRequestsAtom) : get(liveRequestsAtom),
    (get, set, update: RequestItem[] | ((prev: RequestItem[]) => RequestItem[])) => {
        if (get(isDevModeAtom)) {
            const nextValue = typeof update === 'function' ? update(get(devRequestsAtom)) : update;
            set(devRequestsAtom, nextValue);
        } else {
            const nextValue = typeof update === 'function' ? update(get(liveRequestsAtom)) : update;
            set(liveRequestsAtom, nextValue);
        }
    }
);
