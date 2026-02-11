import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, type ChangeEvent } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useModalStore } from "@/store/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User, type DecodedToken } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/auth";
import { useSelectDateStore } from "@/store/selectDate";
import { useUsersStore } from "@/store/users";
import { useEventsStore } from "@/store/events";
import { useSelectedEventStore } from "@/store/selectedEvent";
import { format } from "date-fns";
import { apiFetch } from "@/lib/api";


export default function CreateEventModal() {
    const isOpen = useModalStore((state) => state.isOpen);
    const closeModal = useModalStore((state) => state.closeModal);
    const eventToEdit = useModalStore((state) => state.eventToEdit);

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
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);

    const token = useAuthStore((state) => state.token);
    const selectedDate = useSelectDateStore((state) => state.selectedDate);
    const users = useUsersStore((state) => state.users);
    const fetchUsers = useUsersStore((state) => state.fetchUsers);
    const fetchEvents = useEventsStore((state) => state.fetchEvents);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();

            if (eventToEdit) {
                // Edit mode: populate fields

                setTitle(eventToEdit.title);
                setDate(format(selectedDate, "yyyy-MM-dd"));

                // Convert startMinute/endMinute to HH:mm
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
                        // Cast to any because platform might capitalize differently or look different
                        setPlatform(eventToEdit.location.platform || "");
                        setLink(eventToEdit.location.link || "");
                    } else {
                        setAddress(eventToEdit.location.address || "");
                    }
                }

                if (eventToEdit.participants) {
                    setGuests(eventToEdit.participants);
                } else {
                    setGuests([]);
                }

            } else {
                // Create mode: defaults
                const now = new Date();
                setDate(format(selectedDate, "yyyy-MM-dd"));
                setStartTime(format(now, "HH:mm"));

                // Optional: Set end time to 1 hour later for better UX
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                setEndTime(format(oneHourLater, "HH:mm"));
                setTitle("Meeting");
                setDescription("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua");
                setGuests(currentUser ? [currentUser] : []);
            }
        }
    }, [isOpen, selectedDate, eventToEdit, currentUser, fetchUsers]);

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

    const toggleGuest = (user: User) => {
        if (currentUser && user.id === currentUser.id) return;

        if (guests.find((g) => g.id === user.id)) {
            setGuests(guests.filter((g) => g.id !== user.id));
        } else {
            setGuests([...guests, user]);
        }
    };

    const handleCreateEvent = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        const duration = `${endTotalMinutes - startTotalMinutes} minutes`;
        const time = `${startTime} - ${endTime}`;

        const eventData = {
            title,
            start_date: date,
            time,
            duration,
            type: eventType,
            startMinute: startTotalMinutes,
            endMinute: endTotalMinutes,
            description,
            location: {
                type: locationType,
                platform,
                link,
                address,
            },
            participants: guests.map((g) => parseInt(g.id)),
        };

        try {
            if (startHour < 8 || startHour > 18 || (startHour === 18 && startMinute > 0)) {
                alert("Start time must be between 08:00 and 18:00");
                return;
            }

            if (endHour < 8 || endHour > 18 || (endHour === 18 && endMinute > 0)) {
                alert("End time must be between 08:00 and 18:00");
                return;
            }

            let response;
            if (eventToEdit) {
                response = await apiFetch(`/events/${eventToEdit.id}`, {
                    method: "PUT",
                    body: JSON.stringify(eventData),
                });
            } else {
                response = await apiFetch("/events/", {
                    method: "POST",
                    body: JSON.stringify(eventData),
                });
            }

            if (!response.ok) {
                throw new Error(eventToEdit ? "Failed to update event" : "Failed to create event");
            }

            const updatedEvent = await response.json();

            if (eventToEdit) {
                useSelectedEventStore.getState().setSelectedEvent(updatedEvent);
            }

            closeModal();
            fetchEvents(selectedDate);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 p-0 overflow-hidden gap-0 rounded-xl">
                <DialogHeader className="p-6 border-b border-gray-50 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">event</span>
                        {eventToEdit ? 'Edit Event' : 'Create New Event'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar"
                    onSubmit={handleCreateEvent}
                >
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="title"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                        >
                            Event Title *
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Landing page review"
                            required
                            className="w-full px-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="date"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                            >
                                Date
                            </Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    calendar_today
                                </span>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                Event Type
                            </Label>
                            <div className="flex items-center h-[56px] sm:h-[52px] gap-3 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                                <RadioGroup
                                    value={eventType}
                                    onValueChange={setEventType}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="work"
                                            id="r-purple"
                                            className="sr-only peer"
                                        />
                                        <Label
                                            htmlFor="r-purple"
                                            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-blue-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-blue-500 transition-all cursor-pointer"
                                        ></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="personal"
                                            id="r-orange"
                                            className="sr-only peer"
                                        />
                                        <Label
                                            htmlFor="r-orange"
                                            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-orange-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-orange-500 transition-all cursor-pointer"
                                        ></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="social"
                                            id="r-blue"
                                            className="sr-only peer"
                                        />
                                        <Label
                                            htmlFor="r-blue"
                                            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-green-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-green-500 transition-all cursor-pointer"
                                        ></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="project"
                                            id="r-emerald"
                                            className="sr-only peer"
                                        />
                                        <Label
                                            htmlFor="r-emerald"
                                            className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-purple-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-purple-500 transition-all cursor-pointer"
                                        ></Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="start"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                            >
                                Start Time
                            </Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    schedule
                                </span>
                                <Input
                                    id="start"
                                    type="time"
                                    min="08:00"
                                    max="18:00"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="end"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                            >
                                End Time
                            </Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    schedule
                                </span>
                                <Input
                                    id="end"
                                    type="time"
                                    min="08:00"
                                    max="18:00"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none"
                                />
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-500">
                                info
                            </span>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                Time must be between 08:00 and 18:00
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            {/* <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Location Type</Label> */}
                            <RadioGroup
                                value={locationType}
                                onValueChange={setLocationType}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="online" id="type-online" />
                                    <Label htmlFor="type-online">Online</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="onsite" id="type-onsite" />
                                    <Label htmlFor="type-onsite">Onsite</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {locationType === "online" ? (
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                        Platform
                                    </Label>
                                    <Select value={platform} onValueChange={setPlatform}>
                                        <SelectTrigger className="w-full h-14 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary/20 focus:border-primary text-base">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Zoom">Zoom</SelectItem>
                                            <SelectItem value="Google Meet">Google Meet</SelectItem>
                                            <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="url"
                                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                                    >
                                        Meeting URL
                                    </Label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            link
                                        </span>
                                        <Input
                                            id="url"
                                            placeholder="https://..."
                                            className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-400 text-base"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="location"
                                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                                >
                                    Location
                                </Label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        location_on
                                    </span>
                                    <Input
                                        id="location"
                                        placeholder="Add location or room..."
                                        className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-400 text-base"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="desc"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="desc"
                            placeholder="Add details, links, or agenda..."
                            className="w-full px-4 py-4 rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary resize-none placeholder:text-gray-400 text-base"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                            Guests
                        </Label>
                        <div className="flex items-center gap-4">
                            {guests.length > 0 && (
                                <div className="flex -space-x-3 overflow-hidden">
                                    {guests.slice(0, 3).map((guest) => (
                                        <Avatar
                                            key={guest.id}
                                            className="inline-block h-10 w-10 sm:h-8 sm:w-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                                        >
                                            <AvatarImage
                                                src={guest.image}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>{guest.username[0]}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {guests.length > 3 && (
                                        <div className="flex items-center justify-center h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-gray-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 text-xs font-bold text-gray-500">
                                            +{guests.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-orange-600 hover:bg-transparent transition-colors p-2 h-auto"
                                type="button"
                                onClick={() => setIsGuestDialogOpen(true)}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    person_add
                                </span>
                                {guests.length === 0 ? "Add Guests" : "Edit Guests"}
                            </Button>
                        </div>
                    </div>

                    <Dialog
                        open={isGuestDialogOpen}
                        onOpenChange={setIsGuestDialogOpen}
                    >
                        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-3xl">
                            <DialogHeader>
                                <DialogTitle>Select Guests</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
                                {users
                                    .filter((user) => user.id !== currentUser?.id)
                                    .map((user) => {
                                        const isSelected = guests.some((g) => g.id === user.id);
                                        return (
                                            <div
                                                key={user.id}
                                                className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${isSelected
                                                    ? "bg-primary/10"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    }`}
                                                onClick={() => toggleGuest(user)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.image} />
                                                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">
                                                        {user.username}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-primary">
                                                        check_circle
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={() => setIsGuestDialogOpen(false)}
                                    className="w-full"
                                >
                                    Done
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 pt-4 sm:space-x-0">
                        <Button
                            variant="ghost"
                            onClick={closeModal}
                            className="w-full cursor-pointer sm:flex-1 py-6 rounded-xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full cursor-pointer sm:flex-1 py-6 rounded-xl font-semibold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            type="submit"
                        >
                            <span>{eventToEdit ? "Update Event" : "Save Event"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}