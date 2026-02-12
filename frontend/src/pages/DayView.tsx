import { useState, useEffect } from 'react';
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import UpcomingSidebar from '../components/layout/UpcomingSidebar';
import EventDetailsSidebar from '../components/layout/EventDetailsSidebar';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelectDateStore } from '@/store/selectDate';
import { useSelectedEventStore } from '@/store/selectedEvent';
import { useAuthStore } from '@/store/auth';
import { useEventsStore } from '@/store/events';
import { useModalStore } from '@/store/modal';

export default function DayView() {
    const { events, fetchEvents } = useEventsStore();

    const eventStyleConfig: Record<string, { container: string; title: string; time: string; ring: string }> = {
        work: {
            container: 'bg-blue-50/90 dark:bg-blue-900/40 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/60',
            title: 'text-blue-800 dark:text-blue-200',
            time: 'text-blue-600 dark:text-blue-400',
            ring: 'ring-blue-500',
        },
        personal: {
            container: 'bg-orange-50/90 dark:bg-orange-900/40 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/60',
            title: 'text-orange-800 dark:text-orange-200',
            time: 'text-orange-600 dark:text-orange-400',
            ring: 'ring-orange-500',
        },
        social: {
            container: 'bg-green-50/90 dark:bg-green-900/40 border-green-500 hover:bg-green-100 dark:hover:bg-green-900/60',
            title: 'text-green-800 dark:text-green-200',
            time: 'text-green-600 dark:text-green-400',
            ring: 'ring-green-500',
        },
        project: {
            container: 'bg-purple-50/90 dark:bg-purple-900/40 border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/60',
            title: 'text-purple-800 dark:text-purple-200',
            time: 'text-purple-600 dark:text-purple-400',
            ring: 'ring-purple-500',
        }
    };

    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const setSelectedEvent = useSelectedEventStore((state) => state.setSelectedEvent);
    const setSelectedDate = useSelectDateStore((state) => state.setSelectedDate);

    const openModal = useModalStore((state) => state.openModal);
    const token = useAuthStore((state) => state.token);

    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const handlePrevDay = () => {
        setSelectedDate(addDays(selectedDate, -1));
    };

    const handleNextDay = () => {
        setSelectedDate(addDays(selectedDate, 1));
    };


    useEffect(() => {
        if (token) {
            fetchEvents(selectedDate);
        }
    }, [token, selectedDate, fetchEvents]);

    const handleEventClick = (id: string) => {
        if (selectedEvent?.id?.toString() === id) {
            setSelectedEvent(null);
            return;
        }
        const event = events.find(e => e.id.toString() === id);
        setSelectedEvent(event || null);
    };


    const HOUR_HEIGHT_PX = 96; // py-12 * 2 = 6rem = 96px
    const MINUTE_HEIGHT_PX = HOUR_HEIGHT_PX / 60;
    const START_HOUR = 8; // The view starts at 8 AM
    const END_HOUR = 18; // 6 PM

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const timeInMinutes = (currentHour * 60) + currentMinutes;
    const indicatorTop = (timeInMinutes - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
    const formattedTime = format(currentTime, "h:mm a");

    // Only show if time is within the view range (optional, but good practice)
    // Actually, allowing it to render even if off-screen (due to overflow-hidden) is often simpler.
    // Given the fixed height of the scroll container, it will just not be visible.
    const isVisible = timeInMinutes >= (START_HOUR * 60) && timeInMinutes <= (END_HOUR * 60);

    // Calculate top, height, and horizontal position for events
    const processedEvents = events
        .map(event => {
            const top = (event.startMinute - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
            const height = (event.endMinute - event.startMinute) * MINUTE_HEIGHT_PX;
            return { ...event, top, height };
        })
        .sort((a, b) => a.startMinute - b.startMinute);

    // Calculate overlaps
    const eventsWithLayout = processedEvents.map((event, _index, array) => {
        // Find overlapping events
        const overlappingEvents = array.filter(e =>
            (e.startMinute < event.endMinute && e.endMinute > event.startMinute)
        );

        const totalOverlaps = overlappingEvents.length;

        // Find index of current event within the overlapping group (sorted by start time)
        const indexInGroup = overlappingEvents.indexOf(event);

        // Simple width calculation: 100% / number of overlapping events
        // Use a slightly smaller width (e.g., 95%) to leave a gap
        const widthPercent = 95 / totalOverlaps;
        // Left position is simply index * width
        const leftPercent = indexInGroup * (100 / totalOverlaps);

        return { ...event, widthPercent, leftPercent, zIndex: 10 + indexInGroup };
    });

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            <section className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto scrollbar-hide relative h-full pb-16">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2">
                                {!isDesktop && (
                                    <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={handlePrevDay}>
                                        <ChevronLeft className="h-6! w-6!" />
                                    </Button>
                                )}
                                <h2 className="text-3xl font-bold tracking-tight">{format(selectedDate, "EEEE, MMM d")}</h2>
                                {!isDesktop && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextDay}>
                                        <ChevronRight className="h-6! w-6!" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400">Today is your busiest day this week.</p>
                        </div>
                    </div>

                    <div className="relative space-y-0">
                        {/* Current Time Indicator */}
                        {isVisible && (
                            <div
                                className="absolute w-full left-0 flex items-center z-30 pointer-events-none transition-all duration-1000 ease-in-out"
                                style={{ top: `${indicatorTop}px` }}
                            >
                                <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5"></div>
                                <div className="flex-1 h-px bg-red-500"></div>
                                <div className="ml-4 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                                    {formattedTime}
                                </div>
                            </div>
                        )}

                        {/* Time Grid */}
                        {[...Array(10)].map((_, i) => { // Render 10 hours from 8 AM to 5 PM
                            const hour = START_HOUR + i;
                            const displayHour = hour > 12 ? hour - 12 : hour;
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            return (
                                <div
                                    key={hour}
                                    style={{ height: `${HOUR_HEIGHT_PX}px` }}
                                    className="grid grid-cols-[80px_1fr] border-t border-slate-100 dark:border-slate-800"
                                >
                                    <div className="pr-4 pt-2 text-xs font-medium text-slate-400 text-right">{`${displayHour}:00 ${ampm}`}</div>
                                    <div className="border-l border-slate-100 dark:border-slate-800 h-full"></div>
                                </div>
                            );
                        })}

                        {/* Events */}
                        <div className="absolute top-0 right-0 left-[80px] h-full"> {/* This layer contains all events */}
                            {eventsWithLayout.map(event => {
                                const styles = eventStyleConfig[event.type] || eventStyleConfig.work; // Fallback to work style

                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event.id.toString())}
                                        className={`absolute rounded-r-lg p-3 transition-all cursor-pointer border-l-4 overflow-hidden hover:opacity-100
                                        ${styles.container}
                                        ${selectedEvent?.id === event.id ? 'z-50 shadow-lg scale-[1.02] ring-2 ring-offset-2 dark:ring-offset-slate-900 opacity-100!' : 'opacity-90 hover:shadow-md'}
                                        ${selectedEvent?.id === event.id ? styles.ring : ''}
                                    `}
                                        style={{
                                            top: `${event.top}px`,
                                            // height: `${event.height}px`,
                                            left: `${event.leftPercent}%`,
                                            width: `${event.widthPercent}%`,
                                            zIndex: selectedEvent?.id === event.id ? 50 : event.zIndex
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-xs font-bold truncate ${styles.title}`}>
                                                {event.title}
                                            </p>
                                            {selectedEvent?.id === event.id && (
                                                <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                                            )}
                                        </div>
                                        <p className={`text-xs mt-1 ${styles.time}`}>
                                            {event.time}
                                        </p>
                                        {event.participants && event.participants.length > 0 && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="flex -space-x-1.5">
                                                    {event.participants.slice(0, 3).map((participant, idx) => (
                                                        <Avatar key={idx} className="w-6 h-6 border-2 border-white dark:border-slate-900">
                                                            <AvatarImage src={participant.image} />
                                                            <AvatarFallback className="text-[8px]">
                                                                {participant.username[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                {event.participants.length > 0 && (
                                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                        {event.participants.length > 3 && `+${event.participants.length - 3} others`}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {selectedEvent ? (
                <EventDetailsSidebar />
            ) : (
                <UpcomingSidebar />
            )}

            <Button
                onClick={() => openModal()}
                className="fixed cursor-pointer bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl lg:hidden z-50 p-0 flex items-center justify-center bg-primary text-white hover:bg-orange-600"
            >
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </Button>
        </div>
    );
}
