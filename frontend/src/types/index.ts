// type of event
// blue -> work
// orange -> personal
// green -> social
// purple -> project

export type EventType = 'work' | 'personal' | 'social' | 'project';

export type User = {
    id: string;
    username: string;
    email: string;
    image: string;
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
    start_date?: string; // YYYY-MM-DD
    // attachments?: { name: string; size: string; type: 'pdf' | 'image' | 'zip' }[];
}

export type DecodedToken = {
    sub: string; // User ID
    username: string;
    email: string;
    image?: string;
}