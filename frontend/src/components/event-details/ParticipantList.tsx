import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type User } from "@/types";

interface ParticipantListProps {
    participants: User[];
    currentUser: User | null;
}

export default function ParticipantList({ participants, currentUser }: ParticipantListProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Participants ({participants.length})</h4>
                <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Manage</span>
            </div>
            <div className="space-y-4">
                {participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-xl">
                                <AvatarImage src={participant.image} />
                                <AvatarFallback>{participant.username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold">{participant.username}</p>
                                <p className="text-[10px] text-slate-500">Participant</p>
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className={`px-3 py-0.5 text-[10px] font-bold rounded-2xl
                            ${participant.id == currentUser?.id
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}
                            `}
                        >
                            {participant.id == currentUser?.id ? 'Going' : 'Invited'}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}
