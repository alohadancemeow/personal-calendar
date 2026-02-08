// type of event
// blue -> work
// orange -> personal
// green -> social
// purple -> project
// export const EventType = {
//     work: { value: 'work', color: 'blue' },
//     personal: { value: 'personal', color: 'orange' },
//     social: { value: 'social', color: 'green' },
//     project: { value: 'project', color: 'purple' },
// } as const;

// export type EventType = typeof EventType[keyof typeof EventType];

export type EventType = 'work' | 'personal' | 'social' | 'project';

export type User = {
    id: string;
    name: string;
    avatar: string;
}

type LocationType = {
    type: 'online' | 'onsite';
    platform?: 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'Other';
    link?: string;
    address?: string;
}

export type Event = {
    id: string;
    title: string;
    time: string;
    duration: string;
    type: EventType;
    creator: User;
    participants?: User[];
    startMinute: number; // minutes from midnight
    endMinute: number; // minutes from midnight
    description?: string; // Added description field
    location?: LocationType;
    // attachments?: { name: string; size: string; type: 'pdf' | 'image' | 'zip' }[];
}