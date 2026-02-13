import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelectedEventStore } from '@/store/selectedEvent';
import { eventStyleConfig } from "@/config/event-styles";
import { type Event as EventType } from '@/types';

interface EventProps {
    event: EventType & {
        top: number;
        height: number;
        widthPercent: number;
        leftPercent: number;
        zIndex: number;
    };
    handleEventClick: (id: string) => void;
}

export default function Event({ event, handleEventClick }: EventProps) {
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const styles = eventStyleConfig[event.type] || eventStyleConfig.work;

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
    )
}
