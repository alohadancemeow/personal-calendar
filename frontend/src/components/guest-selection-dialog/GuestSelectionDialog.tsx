import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type User } from "@/types";

interface GuestSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    users: User[];
    guests: User[];
    currentUser: User | null;
    toggleGuest: (user: User) => void;
}

export default function GuestSelectionDialog({
    isOpen,
    onOpenChange,
    users,
    guests,
    currentUser,
    toggleGuest,
}: GuestSelectionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-xl">
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
                        onClick={() => onOpenChange(false)}
                        className="w-full"
                    >
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
