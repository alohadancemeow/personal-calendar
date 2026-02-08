
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
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
import { type User } from "@/types";

const mockUsers: User[] = [
    { id: '1', name: 'Alice', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm_N2x0BptjQ62Q3BwralXr7OCSi7gysJhMSmDOl3n6Sfa-CJHeEngpl5HK73ZZ604C1O5EbRaBwmLfd-LMNsjkjZKkl1ow98TxORp7GLrydCXA7D6EuIgJhTzNYv6sEyBL1s-WiAKh8524j1hZ_rBLriTk7Ow5P0DaOsZxjIWbUJEmRWGf71PsqDMrS8c077rqiTjLy-HHPtmyzRAyfDP9Ha04Np9PmXFx-sA_DmP8WCgzbCxX41KPDYkcElN43BcPd86GiBJoi8' },
    { id: '2', name: 'Bob', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC9nZPRC1Wc9dzD4ozud41LPfOq6rmkRTCRJh-RxDAjkFJ7WtYIzSePQtdyst4wnW9GUT0gBTZE35U_c5yxT3aVSYmMN5tvNKwkhrcfFX2CMhGONViqw87hAN5f2A9HTT3PhAslpxcWHHXBfcqe8S-pcVVgQUjWZxoTTPgB-Wxpm462J5bVy7cR1O17ccMEiXmb2_LULWMLPfTS4SLNMgnZpZxyLHPOzqovn__LS-e0F2onLPMtx7XXLQhbb7uWdvW_MZvbblv7Fo' },
    { id: '3', name: 'Charlie', avatar: '' },
    { id: '4', name: 'David', avatar: '' },
    { id: '5', name: 'Eve', avatar: '' },
];

export default function CreateEventModal() {
    const isOpen = useModalStore((state) => state.isOpen);
    const closeModal = useModalStore((state) => state.closeModal);
    const [locationType, setLocationType] = useState("online");
    const [guests, setGuests] = useState<User[]>([]);
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);

    const toggleGuest = (user: User) => {
        if (guests.find(g => g.id === user.id)) {
            setGuests(guests.filter(g => g.id !== user.id));
        } else {
            setGuests([...guests, user]);
        }
    };

    // todo: handle create event

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 p-0 overflow-hidden gap-0 rounded-t-[2.5rem] sm:rounded-3xl">
                <DialogHeader className="p-6 border-b border-gray-50 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">event</span>
                        Create New Event
                    </DialogTitle>
                </DialogHeader>

                <form className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Event Title *</Label>
                        <Input id="title" placeholder="e.g., Landing page review" required className="w-full px-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Date</Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">calendar_today</span>
                                <Input id="date" type="date" defaultValue="2025-12-22" className="w-full pl-12 pr-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Category Color</Label>
                            <div className="flex items-center h-[56px] sm:h-[52px] gap-3 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                                <RadioGroup defaultValue="purple" className="flex items-center gap-3">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="purple" id="r-purple" className="sr-only peer" />
                                        <Label htmlFor="r-purple" className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-purple-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-purple-500 transition-all cursor-pointer"></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="orange" id="r-orange" className="sr-only peer" />
                                        <Label htmlFor="r-orange" className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-orange-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-orange-500 transition-all cursor-pointer"></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="blue" id="r-blue" className="sr-only peer" />
                                        <Label htmlFor="r-blue" className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-blue-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-blue-500 transition-all cursor-pointer"></Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="emerald" id="r-emerald" className="sr-only peer" />
                                        <Label htmlFor="r-emerald" className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-emerald-500 ring-offset-2 peer-data-[state=checked]:ring-2 ring-emerald-500 transition-all cursor-pointer"></Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="start" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Start Time</Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">schedule</span>
                                <Input id="start" type="time" defaultValue="12:00" className="w-full pl-12 pr-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="end" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">End Time</Label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">schedule</span>
                                <Input id="end" type="time" defaultValue="13:00" className="w-full pl-12 pr-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary text-base appearance-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            {/* <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Location Type</Label> */}
                            <RadioGroup defaultValue="online" onValueChange={setLocationType} className="flex gap-4">
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
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Platform</Label>
                                    <Select>
                                        <SelectTrigger className="w-full h-14 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-primary/20 focus:border-primary text-base">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="zoom">Zoom</SelectItem>
                                            <SelectItem value="meet">Google Meet</SelectItem>
                                            <SelectItem value="teams">Microsoft Teams</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="url" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Meeting URL</Label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">link</span>
                                        <Input id="url" placeholder="https://..." className="w-full pl-12 pr-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-400 text-base" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Location</Label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">location_on</span>
                                    <Input id="location" placeholder="Add location or room..." className="w-full pl-12 pr-4 py-6 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-400 text-base" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="desc" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Description</Label>
                        <Textarea id="desc" placeholder="Add details, links, or agenda..." className="w-full px-4 py-4 rounded-2xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-visible:ring-primary/20 focus-visible:border-primary resize-none placeholder:text-gray-400 text-base" rows={3} />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Guests</Label>
                        <div className="flex items-center gap-4">
                            {guests.length > 0 && (
                                <div className="flex -space-x-3 overflow-hidden">
                                    {guests.slice(0, 3).map((guest) => (
                                        <Avatar key={guest.id} className="inline-block h-10 w-10 sm:h-8 sm:w-8 rounded-full ring-2 ring-white dark:ring-slate-900">
                                            <AvatarImage src={guest.avatar} className="object-cover" />
                                            <AvatarFallback>{guest.name[0]}</AvatarFallback>
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
                                <span className="material-symbols-outlined text-lg">person_add</span>
                                {guests.length === 0 ? "Add Guests" : "Edit Guests"}
                            </Button>
                        </div>
                    </div>

                    <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
                        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-3xl">
                            <DialogHeader>
                                <DialogTitle>Select Guests</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
                                {mockUsers.map((user) => {
                                    const isSelected = guests.some(g => g.id === user.id);
                                    return (
                                        <div
                                            key={user.id}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            onClick={() => toggleGuest(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                            {isSelected && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsGuestDialogOpen(false)} className="w-full">Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 pt-4 sm:space-x-0">
                        <Button
                            variant="ghost"
                            onClick={closeModal}
                            className="w-full cursor-pointer sm:flex-1 py-6 rounded-2xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all" type="button"
                        >
                            Cancel
                        </Button>
                        <Button className="w-full cursor-pointer sm:flex-1 py-6 rounded-2xl font-semibold text-white bg-primary hover:bg-orange-600 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
                            <span>Save Event</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
