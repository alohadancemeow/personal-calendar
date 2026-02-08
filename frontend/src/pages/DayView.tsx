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


const mockEvents: Event[] = [
    {
        id: 'product_sync',
        title: 'Product Sync Meeting',
        time: '9:15 AM - 9:45 AM',
        creator: {
            id: "a",
            name: "A",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
        },
        duration: '30min',
        participants: [
            {
                id: "a",
                name: "A",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
            },
            {
                id: "b",
                name: "B",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
            },
        ],
        type: 'work',
        startMinute: (9 * 60) + 15, // 9:15 AM
        endMinute: (9 * 60) + 45, // 9:45 AM
        description: 'Discuss Q3 product roadmap and sprint goals.',
        location: {
            type: 'onsite',
            address: '123 Main St, San Francisco, CA',
        },
    },
    {
        id: 'landing_page_review',
        title: 'Landing page review',
        time: '11:30 AM - 1:00 PM',
        creator: {
            id: "a",
            name: "A",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
        },
        duration: '1h 30min',
        type: 'personal',
        participants: [
            {
                id: "a",
                name: "A",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
            },
            {
                id: "b",
                name: "B",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
            },
        ],
        startMinute: (13 * 60), // 1:00 PM - changed for visibility in mockup
        endMinute: (14 * 60) + 30, // 2:30 PM - changed for visibility in mockup
        description: 'Review the new landing page design and content with marketing team.',
        location: {
            type: 'online',
            platform: 'Zoom',
            link: 'https://zoom.us/j/1234567890',
        },
        // attachments: [
        //     { name: 'Draft_V2.pdf', size: '1.2 MB', type: 'pdf' },
        //     { name: 'Screenshots.zip', size: '4.5 MB', type: 'zip' },
        // ],
    },
    {
        id: 'team_standup',
        title: 'Team Standup',
        time: '8:00 AM - 8:15 AM',
        creator: {
            id: "a",
            name: "A",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
        },
        duration: '15min',
        type: 'social',
        startMinute: (8 * 60), // 8:00 AM
        endMinute: (8 * 60) + 15, // 8:15 AM
        description: 'Daily sync with the development team to discuss progress and blockers.',
        location: {
            type: 'onsite',
            address: '123 Main St, San Francisco, CA',
        },
    },
    {
        id: 'client_call',
        title: 'Client Call - Project X',
        time: '2:00 PM - 3:00 PM',
        creator: {
            id: "a",
            name: "A",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
        },
        duration: '1hr',
        type: 'project',
        startMinute: (14 * 60), // 2:00 PM
        endMinute: (15 * 60), // 3:00 PM
        description: 'Quarterly review with key client stakeholders for Project X.',
        location: {
            type: 'online',
            platform: 'Microsoft Teams',
            link: 'https://zoom.us/j/1234567890',
        },
    },
    {
        id: 'design_review',
        title: 'Design System Review',
        time: '4:00 PM - 5:00 PM',
        duration: '1hr',
        creator: {
            id: "a",
            name: "A",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo",
        },
        type: 'social',
        participants: [
            {
                id: "d",
                name: "D",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo"
            },
            {
                id: "a",
                name: "D",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo"
            },
            {
                id: "c",
                name: "D",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo"
            }
        ],
        startMinute: (16 * 60), // 4:00 PM
        endMinute: (17 * 60), // 5:00 PM
        description: 'Review updates and new components for the company design system.',
        location: {
            type: 'online',
            platform: 'Google Meet',
            link: 'https://zoom.us/j/1234567890',
        },
    },
];

export default function DayView() {
    const { setIsModalOpen } = useOutletContext<{ setIsModalOpen: (open: boolean) => void }>();
    const selectedDate = useSelectDateStore((state) => state.selectedDate);

    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const setSelectedEvent = useSelectedEventStore((state) => state.setSelectedEvent);

    const handleEventClick = (id: string) => {
        if (selectedEvent?.id === id) {
            setSelectedEvent(null);
            return;
        }
        const event = mockEvents.find(e => e.id === id);
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
    const positionedEvents = mockEvents.map(event => {
        const top = (event.startMinute - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
        const height = (event.endMinute - event.startMinute) * MINUTE_HEIGHT_PX;
        return { ...event, top, height };
    });

    // todo: fetch events on that day

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
                                    onClick={() => handleEventClick(event.id)}
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
                                                        <AvatarImage src={participant.avatar} />
                                                        <AvatarFallback className="text-[8px]">{participant.name}</AvatarFallback>
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
