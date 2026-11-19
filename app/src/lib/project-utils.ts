import type { Challenge, MediaItem } from '../types/project';

// API data may be partial or (for challenges/media) in a legacy string-array
// shape from before those fields were structured objects — this type stays
// tolerant of that on read, while the canonical Project type used for
// editing assumes fully-structured data.
export type RenderableMedia = MediaItem | { type: string; url: string; thumbnail?: string };

export function normalizeChallenges(challenges: Challenge[] | string[] | undefined): Challenge[] {
    if (!challenges || challenges.length === 0) {
        return [];
    }

    // If the first item is a string, it's the legacy string[] format that
    // can't be recovered into structured Challenge objects.
    if (typeof challenges[0] === 'string') {
        return [];
    }

    return challenges as Challenge[];
}

export function normalizeMedia(media: RenderableMedia[] | undefined): MediaItem[] {
    if (!media || media.length === 0) {
        return [];
    }

    return media.map((item) => {
        if ('caption' in item && typeof item.caption === 'string') {
            return {
                type: (item.type as MediaItem['type']) || 'image',
                url: item.url || '',
                caption: item.caption,
                thumbnail: item.thumbnail,
            };
        }

        return {
            type: (item.type as MediaItem['type']) || 'image',
            url: item.url || '',
            caption: item.url || 'Media',
            thumbnail: item.thumbnail,
        };
    });
}
