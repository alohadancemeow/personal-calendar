import { useState, useEffect } from 'react';
import { useModalStore } from '@/store/modal';
import { useAuthStore } from '@/store/auth';
import { useSelectDateStore } from '@/store/selectDate';
import { useUsersStore } from '@/store/users';
import { type User, type DecodedToken } from '@/types';
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

/**
 * A custom hook to manage the state and logic of the event creation/editing form.
 * It encapsulates form field states, initialization logic for create/edit modes,
 * and handles user and guest data.
 *
 * @returns An object containing form state, state setters, and helper functions.
 */
export function useEventForm() {
    const { isOpen, eventToEdit } = useModalStore();
    const token = useAuthStore((state) => state.token);
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const { users, fetchUsers } = useUsersStore();

    // Form field states
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("2025-12-22");
    const [startTime, setStartTime] = useState("12:00");
    const [endTime, setEndTime] = useState("13:00");
    const [eventType, setEventType] = useState("personal");
    const [description, setDescription] = useState("");
    const [locationType, setLocationType] = useState("online");
    const [platform, setPlatform] = useState("");
    const [link, setLink] = useState("");
    const [address, setAddress] = useState("");
    const [guests, setGuests] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Effect to initialize the form when the modal opens.
    useEffect(() => {
        if (isOpen) {
            fetchUsers();

            if (eventToEdit) {
                // "Edit mode": Populate form with event data.
                setTitle(eventToEdit.title);
                setDate(format(selectedDate, "yyyy-MM-dd"));
                const startH = Math.floor(eventToEdit.startMinute / 60);
                const startM = eventToEdit.startMinute % 60;
                setStartTime(`${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`);
                const endH = Math.floor(eventToEdit.endMinute / 60);
                const endM = eventToEdit.endMinute % 60;
                setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
                setEventType(eventToEdit.type);
                setDescription(eventToEdit.description || "");
                if (eventToEdit.location) {
                    setLocationType(eventToEdit.location.type);
                    if (eventToEdit.location.type === 'online') {
                        setPlatform(eventToEdit.location.platform || "");
                        setLink(eventToEdit.location.link || "");
                    } else {
                        setAddress(eventToEdit.location.address || "");
                    }
                }
                setGuests(eventToEdit.participants || []);
            } else {
                // "Create mode": Set default values.
                const now = new Date();
                setDate(format(selectedDate, "yyyy-MM-dd"));
                setStartTime(format(now, "HH:mm"));
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                setEndTime(format(oneHourLater, "HH:mm"));
                setTitle("Meeting");
                setDescription("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua");
                setGuests(currentUser ? [currentUser] : []);
            }
        }
    }, [isOpen, selectedDate, eventToEdit, currentUser, fetchUsers]);

    // Effect to decode the JWT and set the current user.
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                const user: User = {
                    id: decoded.sub,
                    username: decoded.username,
                    email: decoded.email,
                    image: decoded.image || "",
                };
                setCurrentUser(user);
                // Add the current user to the guest list if not already present.
                setGuests((prev) => {
                    const exists = prev.some((g) => g.id === user.id);
                    if (!exists) {
                        return [user, ...prev];
                    }
                    return prev;
                });
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, [token]);

    /**
     * Toggles the selection of a guest.
     * @param user - The user to add or remove from the guest list.
     */
    const toggleGuest = (user: User) => {
        // The current user cannot be removed from the guest list.
        if (currentUser && user.id === currentUser.id) return;

        if (guests.find((g) => g.id === user.id)) {
            setGuests(guests.filter((g) => g.id !== user.id));
        } else {
            setGuests([...guests, user]);
        }
    };

    return {
        title, setTitle,
        date, setDate,
        startTime, setStartTime,
        endTime, setEndTime,
        eventType, setEventType,
        description, setDescription,
        locationType, setLocationType,
        platform, setPlatform,
        link, setLink,
        address, setAddress,
        guests, setGuests,
        currentUser,
        users,
        toggleGuest
    };
}
