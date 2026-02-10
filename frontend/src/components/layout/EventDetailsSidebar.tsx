import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSelectedEventStore } from "@/store/selectedEvent";
import { useModalStore } from "@/store/modal";

export default function EventDetailsSidebar() {
    const selectedEvent = useSelectedEventStore((state) => state.selectedEvent);
    const clearSelectedEvent = useSelectedEventStore((state) => state.clearSelectedEvent);
    const onClose = useModalStore((state) => state.closeModal);


    if (!selectedEvent) {
        return null;
    }

    return (
        <aside className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark flex-col hidden xl:flex">
            <div className={`h-48 bg-linear-to-br p-8 relative flex flex-col justify-end overflow-hidden shrink-0
                         ${selectedEvent.type === 'work' ? 'from-blue-400 to-blue-600' : ''}
                         ${selectedEvent.type === 'personal' ? 'from-orange-400 to-orange-600' : ''}
                         ${selectedEvent.type === 'social' ? 'from-green-400 to-green-600' : ''}
                         ${selectedEvent.type === 'project' ? 'from-purple-400 to-purple-600' : ''}
                         ${!selectedEvent.type ? 'from-orange-400 to-primary' : ''}
                      `}>
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all border-none">
                        <span className="material-symbols-outlined">edit</span>
                    </Button>
                    <Button
                        size="icon"
                        onClick={() => {
                            clearSelectedEvent();
                            onClose()
                        }}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all border-none"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </Button>
                </div>
                <h1 className="text-white text-2xl font-bold">{selectedEvent.title}</h1>
                <p className="text-white/80 text-sm mt-1">Monday, Dec 22 · {selectedEvent.time}</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                    {selectedEvent.description && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Description</h4>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {selectedEvent.description}
                            </p>
                        </div>
                    )}
                    {selectedEvent.location && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Location</h4>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">
                                        {selectedEvent.location.type === 'online' ? 'videocam' : 'location_on'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">
                                        {selectedEvent.location.type === 'online' ? selectedEvent.location.platform : selectedEvent.location.address}
                                    </p>
                                    {selectedEvent.location.type === 'online' && selectedEvent.location.link && (
                                        <a
                                            className="text-xs text-primary hover:underline block truncate"
                                            href={selectedEvent.location.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {selectedEvent.location.link}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Participants ({selectedEvent.participants.length})</h4>
                                <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Manage</span>
                            </div>
                            <div className="space-y-4">
                                {selectedEvent.participants.map((participant, index) => (
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
                                        <Badge variant="secondary" className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded hover:bg-green-200 dark:hover:bg-green-900/40">Going</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Attachments</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedEvent.attachments.map((attachment, index) => (
                                    <div key={index} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <span className={`material-symbols-outlined ${attachment.type === 'pdf' ? 'text-red-500' : attachment.type === 'image' ? 'text-blue-500' : 'text-slate-500'}`}>
                                            {attachment.type === 'pdf' ? 'picture_as_pdf' : attachment.type === 'image' ? 'image' : 'attach_file'}
                                        </span>
                                        <div className="truncate">
                                            <p className="text-[10px] font-bold truncate">{attachment.name}</p>
                                            <p className="text-[8px] text-slate-400">{attachment.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </ScrollArea>
        </aside>
    );
}
