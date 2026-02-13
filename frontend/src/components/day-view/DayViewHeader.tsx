import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from "@/components/ui/button";
import { useSelectDateStore } from '@/store/selectDate';

export default function DayViewHeader() {
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const setSelectedDate = useSelectDateStore((state) => state.setSelectedDate);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const handlePrevDay = () => {
        setSelectedDate(addDays(selectedDate, -1));
    };

    const handleNextDay = () => {
        setSelectedDate(addDays(selectedDate, 1));
    };

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="flex items-center gap-2">
                    {!isDesktop && (
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={handlePrevDay}>
                            <ChevronLeft className="h-6! w-6!" />
                        </Button>
                    )}
                    <h2 className="text-3xl font-bold tracking-tight">{format(selectedDate, "EEEE, MMM d")}</h2>
                    {!isDesktop && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextDay}>
                            <ChevronRight className="h-6! w-6!" />
                        </Button>
                    )}
                </div>
                <p className="text-slate-500 dark:text-slate-400">Today is your busiest day this week.</p>
            </div>
        </div>
    )
}
