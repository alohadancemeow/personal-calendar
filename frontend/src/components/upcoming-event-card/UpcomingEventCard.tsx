import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type Event } from "@/types";
import { colorMap, getEventColor } from "@/config/upcoming-event-styles";
import { useSelectedEventStore } from "@/store/selectedEvent";

interface UpcomingEventCardProps {
    event: Event;
}

export default function UpcomingEventCard({ event }: UpcomingEventCardProps) {
    const setSelectedEvent = useSelectedEventStore((state) => state.setSelectedEvent);
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
}
