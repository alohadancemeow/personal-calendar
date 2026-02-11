import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventDetailsContent from "./EventDetailsContent";
import { useSelectedEventStore } from "@/store/selectedEvent";

export default function EventDetailsSidebar() {
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const clearSelectedEvent = useSelectedEventStore((state) => state.clearSelectedEvent);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    if (!selectedEvent) return null;

    if (isDesktop) {
        return (
            <aside className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark flex-col hidden lg:flex">
                <EventDetailsContent />
            </aside>
        );
    }

    return (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && clearSelectedEvent()}>
            <DialogContent className="p-0 overflow-hidden text-left align-middle sm:max-w-[420px] gap-0 border-none shadow-none bg-transparent [&>button]:hidden outline-none">
                <DialogHeader className="hidden">
                    <DialogTitle className="hidden" />
                    <DialogDescription className="hidden" />
                </DialogHeader>
                <div className="rounded-xl overflow-hidden bg-background dark:bg-background-dark shadow-2xl h-[85vh] sm:h-auto flex flex-col w-full">
                    <EventDetailsContent />
                </div>
            </DialogContent>
        </Dialog>
    );
}
