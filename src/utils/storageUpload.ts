/** Firebase object names cannot contain certain characters; strip risky segments. */
export function safeStorageObjectName(originalName: string, fallback = 'image.jpg'): string {
    const base = (originalName || fallback).replace(/[\[\]#*?]/g, '_').replace(/\.\./g, '_').trim() || fallback;
    return base.slice(0, 180);
}

/** Prefer the original File type; compressed Blobs often lose `type`. */
export function guessImageContentType(source: File | Blob, fallback = 'image/jpeg'): string {
    if ('type' in source && source.type && source.type.startsWith('image/')) {
        return source.type;
    }
    const name = 'name' in source && typeof source.name === 'string' ? source.name : '';
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    if (ext === 'gif') return 'image/gif';
    if (ext === 'svg') return 'image/svg+xml';
    return fallback;
}
