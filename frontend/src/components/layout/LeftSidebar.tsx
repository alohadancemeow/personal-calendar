import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectDateStore } from '@/store/selectDate';
import { useModalStore } from '@/store/modal';
import { useAuthStore } from '@/store/auth';
import { type Event } from '@/types';
import { apiFetch } from '@/lib/api';
import Footer from "./Footer";

const eventTypeDefault = [
    { type: 'work', color: 'bg-blue-500' },
    { type: 'personal', color: 'bg-orange-500' },
    { type: 'social', color: 'bg-green-500' },
    { type: 'project', color: 'bg-purple-500' },
];

export default function LeftSidebar() {
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const setSelectedDate = useSelectDateStore((state) => state.setSelectedDate);
    const openModal = useModalStore((state) => state.openModal);
    const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchEventCounts = async () => {
            try {
                const response = await apiFetch(`/events/?limit=1000`);
                if (response.ok) {
                    const data: Event[] = await response.json();
                    const counts: Record<string, number> = {
                        work: 0,
                        personal: 0,
                        social: 0,
                        project: 0
                    };

                    data.forEach(event => {
                        if (counts[event.type] !== undefined) {
                            counts[event.type]++;
                        }
                    });

                    setEventCounts(counts);
                }
            } catch (error) {
                console.error("Failed to fetch event counts", error);
            }
        };

        if (token) {
            fetchEventCounts();
        }
    }, [token]);

    // Count unique types that have at least one event
    const totalEvents = Object.values(eventTypeDefault).length;

    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark lg:flex hidden flex-col h-full">
            <div className="p-6">
                <Button
                    className="w-full cursor-pointer bg-primary hover:bg-orange-600 text-white font-semibold py-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 text-base"
                    onClick={() => openModal()}
                >
                    <span className="material-symbols-outlined">add</span>
                    Add event
                </Button>
            </div>

            <ScrollArea className="flex-1 px-6">
                <div className="mb-8">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        required
                        className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 w-full flex justify-center"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            Event Types <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium text-slate-500">{totalEvents}</span>
                        </h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="material-symbols-outlined text-xs">add</span>
                        </Button>
                    </div>

                    {eventTypeDefault.map((type) => (
                        <div key={type.type} className="space-y-1">
                            <Button variant="ghost" className="w-full justify-between gap-3 px-2 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 h-10 capitalization group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full shrink-0
                                        ${type.type === 'work' ? 'bg-blue-500' : ''}
                                        ${type.type === 'personal' ? 'bg-orange-500' : ''}
                                        ${type.type === 'social' ? 'bg-green-500' : ''}
                                        ${type.type === 'project' ? 'bg-purple-500' : ''}
                                    `}>
                                    </div>
                                    <span className="capitalize">{type.type}</span>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-slate-600 bg-slate-50 dark:bg-slate-800 dark:group-hover:bg-slate-700 px-2 py-0.5 rounded-full min-w-[24px] text-center transition-colors">
                                    {eventCounts[type.type] || 0}
                                </span>
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <Footer />
        </aside>
    );
}
