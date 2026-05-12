import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { liveItemsAtom, refreshAtom } from '../atoms/appAtoms';
import { liveRequestsAtom } from '../atoms/modalAtoms';
import type { ResourceItem, RequestItem } from '../types';

function normalizeVizImages<T extends { vizImages?: ResourceItem['vizImages'] }>(data: T): T {
    const v = data.vizImages;
    if (!v || typeof v !== 'object') return data;
    const trim = (s: unknown) => (typeof s === 'string' ? s.trim() : s);
    return {
        ...data,
        vizImages: {
            result: trim(v.result) as string | undefined,
            original: trim(v.original) as string | undefined,
            style: trim(v.style) as string | undefined,
        },
    };
}

/**
 * Background component that synchronizes Firestore collections with Jotai atoms.
 * Only active when Dev Mode is toggled off (handled via atom logic if needed, 
 * but listening always keeps the live state ready).
 */
export function FirebaseSync() {
    const [, setLiveItems] = useAtom(liveItemsAtom);
    const [, setLiveRequests] = useAtom(liveRequestsAtom);
    const [refresh] = useAtom(refreshAtom);

    useEffect(() => {
        // Sync Resources
        const resourcesQuery = query(collection(db, 'resources'), orderBy('date', 'desc'));
        const unsubResources = onSnapshot(resourcesQuery, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data();

                // Backwards compatibility layer for legacy data
                let kind = data.kind;
                if (kind === 'use') kind = 'tool';
                if (kind === 'learn') kind = 'guide';

                return {
                    id: doc.id as any,
                    ...normalizeVizImages(data),
                    kind
                };
            }) as ResourceItem[];
            setLiveItems(items);
        }, (error) => {
            console.error("Firestore Resources Sync Error:", error);
        });

        // Sync Requests
        const requestsQuery = query(collection(db, 'requests'), orderBy('votes', 'desc'));
        const unsubRequests = onSnapshot(requestsQuery, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({
                id: doc.id as any,
                ...doc.data()
            })) as RequestItem[];
            setLiveRequests(reqs);
        }, (error) => {
            console.error("Firestore Requests Sync Error:", error);
        });

        return () => {
            unsubResources();
            unsubRequests();
        };
    }, [setLiveItems, setLiveRequests, refresh]);

    return null; // Side-effect only component
}
