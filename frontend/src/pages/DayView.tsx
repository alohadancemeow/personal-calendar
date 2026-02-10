import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { useOutletContext } from 'react-router-dom';
import UpcomingSidebar from '../components/layout/UpcomingSidebar';
import EventDetailsSidebar from '../components/layout/EventDetailsSidebar';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Event } from '@/types';
import { useSelectDateStore } from '@/store/selectDate';
import { useSelectedEventStore } from '@/store/selectedEvent';
import { useAuthStore } from '@/store/auth';

export default function DayView() {
    const [events, setEvents] = useState<Event[]>([]);

    const { setIsModalOpen } = useOutletContext<{ setIsModalOpen: (open: boolean) => void }>();
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const setSelectedEvent = useSelectedEventStore((state) => state.setSelectedEvent);

    const token = useAuthStore((state) => state.token);

    console.log(events, 'events');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                const response = await fetch(`http://localhost:8000/events/?date=${formattedDate}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (token) {
            fetchEvents();
        }
    }, [token, selectedDate]);

    const handleEventClick = (id: string) => {
        if (selectedEvent?.id === id) {
            setSelectedEvent(null);
            return;
        }
        const event = events.find(e => e.id.toString() === id);
        setSelectedEvent(event || null);
    };


    const HOUR_HEIGHT_PX = 96; // py-12 * 2 = 6rem = 96px
    const MINUTE_HEIGHT_PX = HOUR_HEIGHT_PX / 60;
    const START_HOUR = 8; // The view starts at 8 AM

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
    const isVisible = timeInMinutes >= (START_HOUR * 60) && indicatorTop >= 0;

    // Calculate top and height for events
    const positionedEvents = events.map(event => {
        const top = (event.startMinute - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
        const height = (event.endMinute - event.startMinute) * MINUTE_HEIGHT_PX;
        return { ...event, top, height };
    });

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            <section className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto scrollbar-hide relative h-full">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{format(selectedDate, "EEEE, MMM d")}</h2>
                            <p className="text-slate-500 dark:text-slate-400">Today is your busiest day this week.</p>
                        </div>
                    </div>

                    <div className="relative space-y-0">
                        {/* Current Time Indicator */}
                        {isVisible && (
                            <div
                                className="absolute w-full left-0 flex items-center z-50 pointer-events-none transition-all duration-1000 ease-in-out"
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
                            {positionedEvents.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => handleEventClick(event.id.toString())}
                                    className={`absolute inset-x-4 rounded-r-xl p-4 transition-all cursor-pointer z-20
                                        ${event.type === 'work' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''}
                                        ${event.type === 'personal' ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500' : ''}
                                        ${event.type === 'social' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' : ''}
                                        ${event.type === 'project' ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500' : ''}
                                        ${selectedEvent?.id === event.id ? '' : 'hover:shadow-md'}
                                    `}
                                    style={{
                                        top: `${event.top}px`,
                                        // height: `${event.height}px`
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm font-bold ${event.type === 'work' ? 'text-blue-800 dark:text-blue-300' : ''}
                                            ${event.type === 'personal' ? 'text-orange-800 dark:text-orange-300' : ''}
                                            ${event.type === 'social' ? 'text-green-800 dark:text-green-300' : ''}
                                            ${event.type === 'project' ? 'text-purple-800 dark:text-purple-300' : ''}
                                        `}>
                                            {event.title}
                                        </p>
                                        {selectedEvent?.id === event.id && (
                                            <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 ${event.type === 'work' ? 'text-blue-600 dark:text-blue-400' : ''}
                                        ${event.type === 'personal' ? 'text-orange-600 dark:text-orange-400' : ''}
                                        ${event.type === 'social' ? 'text-green-600 dark:text-green-400' : ''}
                                        ${event.type === 'project' ? 'text-purple-600 dark:text-purple-400' : ''}
                                    `}>
                                        {event.time}
                                    </p>
                                    {event.participants && event.participants.length > 0 && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="flex -space-x-1.5">
                                                {event.participants.map((participant, idx) => (
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
                                                    +{event.participants.length} others
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
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
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl lg:hidden z-25 p-0 flex items-center justify-center bg-primary text-white hover:bg-orange-600"
            >
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </Button>
        </div>
    );
}
