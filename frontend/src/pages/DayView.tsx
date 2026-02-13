import { useEffect } from 'react';
import UpcomingSidebar from '../components/layout/UpcomingSidebar';
import EventDetailsSidebar from '../components/layout/EventDetailsSidebar';
import { Button } from "@/components/ui/button";
import { useSelectDateStore } from '@/store/selectDate';
import { useSelectedEventStore } from '@/store/selectedEvent';
import { useAuthStore } from '@/store/auth';
import { useEventsStore } from '@/store/events';
import { useModalStore } from '@/store/modal';
import DayViewHeader from '@/components/day-view/DayViewHeader';
import CurrentTimeIndicator from '@/components/day-view/CurrentTimeIndicator';
import TimeGrid from '@/components/day-view/TimeGrid';
import Event from '@/components/day-view/Event';
import { useEventLayout } from '@/hooks/use-event-layout';

/**
 * The main component for the day view of the calendar.
 * It orchestrates the display of the calendar grid, events, and sidebars.
 */
export default function DayView() {
    const { events, fetchEvents } = useEventsStore();
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const { selectedEvent, setSelectedEvent } = useSelectedEventStore();
    const token = useAuthStore((state) => state.token);
    const openModal = useModalStore((state) => state.openModal);

    // Calculate event layout using the custom hook.
    const eventsWithLayout = useEventLayout(events);

    // Fetch events when the selected date or token changes.
    useEffect(() => {
        if (token) {
            fetchEvents(selectedDate);
        }
    }, [token, selectedDate, fetchEvents]);

    /**
     * Handles clicking on an event to select or deselect it.
     * @param id - The ID of the clicked event.
     */
    const handleEventClick = (id: string) => {
        if (selectedEvent?.id?.toString() === id) {
            setSelectedEvent(null); // Deselect if the same event is clicked again.
            return;
        }
        const event = events.find(e => e.id.toString() === id);
        setSelectedEvent(event || null);
    };

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            <section className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto scrollbar-hide relative h-full pb-16">
                <div className="p-8">
                    <DayViewHeader />
                    <div className="relative space-y-0">
                        <CurrentTimeIndicator />
                        <TimeGrid />
                        {/* Event rendering layer */}
                        <div className="absolute top-0 right-0 left-[80px] h-full">
                            {eventsWithLayout.map(event => (
                                <Event key={event.id} event={event} handleEventClick={handleEventClick} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Conditionally render the appropriate sidebar. */}
            {selectedEvent ? (
                <EventDetailsSidebar />
            ) : (
                <UpcomingSidebar />
            )}

            {/* Floating action button for creating a new event on mobile. */}
            <Button
                onClick={() => openModal()}
                className="fixed cursor-pointer bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl lg:hidden z-50 p-0 flex items-center justify-center bg-primary text-white hover:bg-orange-600"
            >
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </Button>
        </div>
    );
}
