import { useState, useEffect } from 'react';
import { format } from "date-fns";

const START_HOUR = 8; // The view starts at 8 AM
const END_HOUR = 18; // 6 PM
const HOUR_HEIGHT_PX = 96; // py-12 * 2 = 6rem = 96px
const MINUTE_HEIGHT_PX = HOUR_HEIGHT_PX / 60;

export default function CurrentTimeIndicator() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const timeInMinutes = (currentHour * 60) + currentMinutes;
    const indicatorTop = (timeInMinutes - (START_HOUR * 60)) * MINUTE_HEIGHT_PX;
    const formattedTime = format(currentTime, "h:mm a");

    const isVisible = timeInMinutes >= (START_HOUR * 60) && timeInMinutes <= (END_HOUR * 60);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="absolute w-full left-0 flex items-center z-30 pointer-events-none transition-all duration-1000 ease-in-out"
            style={{ top: `${indicatorTop}px` }}
        >
            <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5"></div>
            <div className="flex-1 h-px bg-red-500"></div>
            <div className="ml-4 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                {formattedTime}
            </div>
        </div>
    );
}
