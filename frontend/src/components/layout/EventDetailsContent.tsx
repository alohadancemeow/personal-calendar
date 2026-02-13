import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedEventStore } from "@/store/selectedEvent";
import { useAuthStore } from "@/store/auth";
import EventDetailsHeader from "@/components/event-details/EventDetailsHeader";
import LocationDetails from "@/components/event-details/LocationDetails";
import ParticipantList from "@/components/event-details/ParticipantList";

export default function EventDetailsContent() {
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const user = useAuthStore((state) => state.user);

    if (!selectedEvent) {
        return null;
    }

    return (
        <div className="flex flex-col h-full w-full bg-card-light dark:bg-card-dark">
            <EventDetailsHeader />
            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                    {selectedEvent.description && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Description</h4>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 break-all whitespace-pre-wrap">
                                {selectedEvent.description}
                            </div>
                        </div>
                    )}
                    {selectedEvent.location && (
                        <LocationDetails location={selectedEvent.location} />
                    )}
                    {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                        <ParticipantList participants={selectedEvent.participants} currentUser={user} />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
