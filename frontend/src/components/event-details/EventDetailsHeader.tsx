import { Button } from "@/components/ui/button";
import { useSelectedEventStore } from "@/store/selectedEvent";
import { useModalStore } from "@/store/modal";
import { format } from "date-fns";
import { useSelectDateStore } from "@/store/selectDate";

const eventTypeColors: Record<string, string> = {
    work: 'from-blue-400 to-blue-600',
    personal: 'from-orange-400 to-orange-600',
    social: 'from-green-400 to-green-600',
    project: 'from-purple-400 to-purple-600',
    default: 'from-orange-400 to-primary'
};

export default function EventDetailsHeader() {
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const clearSelectedEvent = useSelectedEventStore((state) => state.clearSelectedEvent);
    const { openModal } = useModalStore();
    const onClose = useModalStore((state) => state.closeModal);
    const selectedDate = useSelectDateStore((state) => state.selectedDate);

    if (!selectedEvent) {
        return null;
    }

    const displayDate = selectedEvent.start_date ? new Date(selectedEvent.start_date) : selectedDate;
    const headerClass = eventTypeColors[selectedEvent.type] || eventTypeColors.default;

    return (
        <div className={`h-48 bg-linear-to-br p-8 relative flex flex-col justify-end overflow-hidden shrink-0 ${headerClass}`}>
            <div className="absolute top-4 right-4 flex gap-2">
                <Button
                    size="icon"
                    onClick={() => openModal(selectedEvent)}
                    className="bg-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all border-none"
                >
                    <span className="material-symbols-outlined">edit</span>
                </Button>
                <Button
                    size="icon"
                    onClick={() => {
                        clearSelectedEvent();
                        onClose()
                    }}
                    className="bg-white/20 cursor-pointer hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all border-none"
                >
                    <span className="material-symbols-outlined">close</span>
                </Button>
            </div>
            <h1 className="text-white text-2xl font-bold">{selectedEvent.title}</h1>
            <p className="text-white/80 text-sm mt-1">
                {format(displayDate, 'EEEE, MMM d')} · {selectedEvent.time}
            </p>
        </div>
    );
}
