const HOUR_HEIGHT_PX = 96; // py-12 * 2 = 6rem = 96px
const START_HOUR = 8; // The view starts at 8 AM

export default function TimeGrid() {
    return (
        <div className="relative space-y-0">
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
        </div>
    )
}
