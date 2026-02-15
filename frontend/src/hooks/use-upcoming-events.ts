import { useState, useEffect, useCallback } from 'react';
import { type Event } from "@/types";
import { apiFetch } from "@/lib/api";
import { format, addDays } from "date-fns";
import { useEventsStore } from "@/store/events";

/**
 * A custom hook to fetch and manage upcoming events for today and tomorrow.
 * It periodically refreshes the event data to keep the view up-to-date.
 *
 * @returns An object containing `todayEvents`, `tomorrowEvents`, and a `loading` state.
 */
export function useUpcomingEvents() {
    const [todayEvents, setTodayEvents] = useState<Event[]>([]);
    const [tomorrowEvents, setTomorrowEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetches events for today and tomorrow and filters them.
    const fetchUpcomingEvents = useCallback(async () => {
        try {
            setLoading(true);
            const today = new Date();
            const tomorrow = addDays(today, 1);

            const todayStr = format(today, "yyyy-MM-dd");
            const tomorrowStr = format(tomorrow, "yyyy-MM-dd");

            const [todayRes, tomorrowRes] = await Promise.all([
                apiFetch(`/events/?date=${todayStr}`),
                apiFetch(`/events/?date=${tomorrowStr}`)
            ]);

            if (todayRes.ok && tomorrowRes.ok) {
                const todayData: Event[] = await todayRes.json();
                const tomorrowData: Event[] = await tomorrowRes.json();

                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();

                // Filter today's events to only include future events.
                const filteredToday = todayData.filter(event => {
                    return event.startMinute > currentMinutes;
                });

                setTodayEvents(filteredToday);
                setTomorrowEvents(tomorrowData);
            }
        } catch (error) {
            console.error("Failed to fetch upcoming events", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshTrigger = useEventsStore((state) => state.refreshTrigger);

    // Effect to fetch events on mount and set up a polling interval.
    useEffect(() => {
        fetchUpcomingEvents();
        const interval = setInterval(fetchUpcomingEvents, 60000); // Refresh every minute.
        return () => clearInterval(interval);
    }, [fetchUpcomingEvents, refreshTrigger]);

    return { todayEvents, tomorrowEvents, loading };
}
