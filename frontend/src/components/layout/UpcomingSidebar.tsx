import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModalStore } from "@/store/modal";
import { useUpcomingEvents } from "@/hooks/use-upcoming-events";
import UpcomingEventCard from "../upcoming-event-card/UpcomingEventCard";

export default function UpcomingSidebar() {
    const openModal = useModalStore((state) => state.openModal);
    const { todayEvents, tomorrowEvents, loading } = useUpcomingEvents();

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
                                        {todayEvents.map(event => <UpcomingEventCard key={event.id} event={event} />)}
                                    </div>
                                </div>
                            )}

                            {tomorrowEvents.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Tomorrow</h3>
                                    <div className="space-y-1">
                                        {tomorrowEvents.map(event => <UpcomingEventCard key={event.id} event={event} />)}
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
