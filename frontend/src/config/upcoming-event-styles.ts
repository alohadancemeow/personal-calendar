export const colorMap: Record<string, { dot: string; badge: string }> = {
    blue: {
        dot: 'bg-blue-500 ring-4 ring-blue-500/10',
        badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
    },
    orange: {
        dot: 'bg-orange-500 ring-4 ring-orange-500/10',
        badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40'
    },
    green: {
        dot: 'bg-green-500 ring-4 ring-green-500/10',
        badge: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
    },
    purple: {
        dot: 'bg-purple-500 ring-4 ring-purple-500/10',
        badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40'
    },
    gray: {
        dot: 'bg-gray-500 ring-4 ring-gray-500/10',
        badge: 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/40'
    }
};

export const getEventColor = (type: string) => {
    switch (type) {
        case 'work': return 'blue';
        case 'personal': return 'orange';
        case 'social': return 'green';
        case 'project': return 'purple';
        default: return 'gray';
    }
};
