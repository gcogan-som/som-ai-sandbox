export const OFFICES = [
    'Firmwide',
    'Austin',
    'Chicago',
    'Dubai',
    'Guangzhou',
    'Hong Kong',
    'London',
    'Los Angeles',
    'Melbourne',
    'New York',
    'Riyadh',
    'San Francisco',
    'Seattle',
    'Shanghai',
    'Washington, D.C.'
] as const;

export type OfficeName = typeof OFFICES[number];
