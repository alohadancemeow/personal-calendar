import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useModalStore } from "@/store/modal";
import { useEffect, useState } from "react";
import { type Event } from "@/types";
import { apiFetch } from "@/lib/api";
import { format, addDays } from "date-fns";
import { useSelectedEventStore } from "@/store/selectedEvent";

export default function UpcomingSidebar() {
    const openModal = useModalStore((state) => state.openModal);
    const setSelectedEvent = useSelectedEventStore((state) => state.setSelectedEvent);
    const [todayEvents, setTodayEvents] = useState<Event[]>([]);
    const [tomorrowEvents, setTomorrowEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUpcomingEvents = async () => {
        try {
            setLoading(true);
            const today = new Date();
            const tomorrow = addDays(today, 1);

            const todayStr = format(today, "yyyy-MM-dd");
            const tomorrowStr = format(tomorrow, "yyyy-MM-dd");

            // Fetch individually for simplicity, or could modify backend to accept range
            // Assuming backend accepts date param.
            const [todayRes, tomorrowRes] = await Promise.all([
                apiFetch(`/events/?date=${todayStr}`),
                apiFetch(`/events/?date=${tomorrowStr}`)
            ]);

            if (todayRes.ok && tomorrowRes.ok) {
                const todayData: Event[] = await todayRes.json();
                const tomorrowData: Event[] = await tomorrowRes.json();

                // Filter today's events to strictly future events (start time > now)
                // Event time is string "HH:mm", we need to combine with date to compare
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();

                const filteredToday = todayData.filter(event => {
                    // Check if event start minutes is greater than current minutes
                    return event.startMinute > currentMinutes;
                });

                setTodayEvents(filteredToday);
                setTomorrowEvents(tomorrowData);
            }
        } catch (error) {
            console.error("Failed to fetch upcoming events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingEvents();
        // Set up an interval to refresh every minute to update "future" status
        const interval = setInterval(fetchUpcomingEvents, 60000);
        return () => clearInterval(interval);
    }, []);

    const colorMap: Record<string, { dot: string; badge: string }> = {
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

    const getEventColor = (type: string) => {
        switch (type) {
            case 'work': return 'blue';
            case 'personal': return 'orange';
            case 'social': return 'green';
            case 'project': return 'purple';
            default: return 'gray';
        }
    };

    const renderEventCard = (event: Event) => {
        const color = getEventColor(event.type);
        const styles = colorMap[color] || colorMap.gray;

        return (
            <div
                key={event.id}
                className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                onClick={() => setSelectedEvent(event)}
            >
                <div className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                        <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
                        <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-2 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{event.title}</h4>
                            <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0.5 rounded-2xl uppercase tracking-wider ${styles.badge}`}>{event.type}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{event.time}</p>

                        {(event.participants && event.participants.length > 0) && (
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex -space-x-1.5">
                                    {event.participants.slice(0, 3).map((p, i) => (
                                        <Avatar key={i} className="w-5 h-5 ring-2 ring-white dark:ring-slate-900">
                                            <AvatarImage src={p.image} />
                                            <AvatarFallback className="text-[8px]">{p.username[0]}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                    {event.participants.length > 3
                                        ? `+${event.participants.length - 3} others`
                                        : 'participants'}
                                </span>
                            </div>
                        )}

                        {event.location && (
                            <div className="mt-3">
                                <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800 rounded-xl p-2">
                                    <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                                    <span className="text-[10px] text-slate-500 truncate">
                                        {event.location.type === 'online' ? event.location.platform : event.location.address}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <aside className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark flex-col hidden lg:flex overflow-hidden xl:flex h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Upcoming</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-500 text-xl">more_vert</span>
                    </Button>
                </div>
                <p className="text-sm text-slate-500 mt-1">Next 24 hours</p>
            </div>
            <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-6 p-6">
                    {loading ? (
                        <div className="text-center text-slate-400 text-sm py-8">Loading events...</div>
                    ) : (
                        <>
                            {todayEvents.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Today</h3>
                                    <div className="space-y-1">
                                        {todayEvents.map(renderEventCard)}
                                    </div>
                                </div>
                            )}

                            {tomorrowEvents.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Tomorrow</h3>
                                    <div className="space-y-1">
                                        {tomorrowEvents.map(renderEventCard)}
                                    </div>
                                </div>
                            )}

                            {todayEvents.length === 0 && tomorrowEvents.length === 0 && (
                                <div className="text-center text-slate-400 text-sm py-8">No upcoming events</div>
                            )}
                        </>
                    )}
                </div>
            </ScrollArea>
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                <Button
                    onClick={() => openModal()}
                    variant="outline"
                    className="w-full py-6 border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary transition-all rounded-2xl font-semibold text-slate-400 flex items-center justify-center gap-2 h-auto text-base"
                >
                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                    Quick Add Task
                </Button>
            </div>
        </aside>
    );
}
