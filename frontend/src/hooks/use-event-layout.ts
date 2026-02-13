import { useMemo } from 'react';
import { type Event } from '@/types';

const HOUR_HEIGHT_PX = 96; // Corresponds to Tailwind's h-24 (6rem = 96px)
const MINUTE_HEIGHT_PX = HOUR_HEIGHT_PX / 60;
const START_HOUR = 8; // The calendar view starts at 8:00 AM

/**
 * A custom hook to calculate the layout properties (top, height, width, and z-index) for a list of events.
 * This hook processes events to handle overlapping and positioning within a calendar day view.
 *
 * @param events - An array of event objects to be laid out.
 * @returns An array of event objects, each augmented with `top`, `height`, `widthPercent`, `leftPercent`, and `zIndex` properties.
 */
export function useEventLayout(events: Event[]) {
    // Memoize the initial processing of events to calculate top and height.
    const processedEvents = useMemo(() => {
        return events
            .map(event => {
                // Calculate the top offset based on the event's start time.
                const top = (event.startMinute - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
                // Calculate the height based on the event's duration.
                const height = (event.endMinute - event.startMinute) * MINUTE_HEIGHT_PX;
                return { ...event, top, height };
            })
            // Sort events by their start time to ensure consistent layout.
            .sort((a, b) => a.startMinute - b.startMinute);
    }, [events]);

    // Memoize the layout calculation to handle overlaps.
    const eventsWithLayout = useMemo(() => {
        return processedEvents.map((event, _index, array) => {
            // Find all events that overlap with the current event.
            const overlappingEvents = array.filter(e =>
                (e.startMinute < event.endMinute && e.endMinute > event.startMinute)
            );

            const totalOverlaps = overlappingEvents.length;
            // Determine the order of the current event within its overlapping group.
            const indexInGroup = overlappingEvents.indexOf(event);

            // Calculate the width as a percentage, leaving a small gap between events.
            const widthPercent = 95 / totalOverlaps;
            // Calculate the horizontal position based on the event's order in the overlap group.
            const leftPercent = indexInGroup * (100 / totalOverlaps);

            return { ...event, widthPercent, leftPercent, zIndex: 10 + indexInGroup };
        });
    }, [processedEvents]);

    return eventsWithLayout;
}
