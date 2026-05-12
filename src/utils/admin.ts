import type { AuthUser } from '../types/auth';

export const ADMIN_EMAILS = ['grant.cogan@som.com'];
export const ADMIN_NAMES = ['Grant Cogan'];

export const checkIsAdmin = (user: AuthUser | null | undefined): boolean => {
    if (!user) return false;
    return !!(
        (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ||
        (user.displayName && ADMIN_NAMES.includes(user.displayName))
    );
};
