import { atom } from 'jotai';
import type { ResourceItem, RequestItem } from '../types';
import { REQUESTS_INIT } from '../data/mockRequests';

export const selectedItemAtom = atom<ResourceItem | null>(null);
export const showSubmitAtom = atom(false);
export const showAboutAtom = atom(false);
export const showReqAtom = atom(false);
export const requestsAtom = atom<RequestItem[]>(REQUESTS_INIT);
