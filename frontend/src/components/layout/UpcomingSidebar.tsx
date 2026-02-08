import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useModalStore } from "@/store/modal";

export default function UpcomingSidebar() {
    const openModal = useModalStore((state) => state.openModal);

    // toto: fetch upcoming events from API

    return (
        <aside className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark flex flex-col overflow-hidden hidden xl:flex">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Upcoming</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-500 text-xl">more_vert</span>
                    </Button>
                </div>
                <p className="text-sm text-slate-500 mt-1">Next 24 hours</p>
            </div>
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Today</h3>
                        <div className="space-y-1">
                            <div className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/10"></div>
                                        <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-2 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Design Critique Session</h4>
                                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-900/40">Work</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">2:30 PM - 3:30 PM</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="flex -space-x-1.5">
                                                <Avatar className="w-5 h-5 ring-2 ring-white dark:ring-slate-900">
                                                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCw5fUmU--4uSkWdqGF4JqzwHW0a3Y2B6EacZqbjyY7QKV2IttpjE0bmx32mmwfYNewlWiFbx6lV5uZEMOYKl-q9WBvoSzGWce706MpDOsDHhY0oDshI5WMvYQLzxAJDzINtf6h8QxCfZJRfAFMU8lGf6L4epUHf47r7usgJcNiwmB6_vWaxAEWpf_Ucz0Q3X1g6XS-2f-se_Sm0g59_-u3Cm4hsS-S6jm-89D-0Q5GHRTRW9Ymo--xh6yOzUpLKedNzaFr4AregQ" />
                                                    <AvatarFallback className="text-[8px]">SA</AvatarFallback>
                                                </Avatar>
                                                <Avatar className="w-5 h-5 ring-2 ring-white dark:ring-slate-900">
                                                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZaAZT9PrC8BixcpjDdkJHSugfp6_vGH_SMBqvxMMAljBJzekGem7KhNaGh8-821eRcjlHu_Sy-tuDoEDeqo0tJwg8tJzMf8BbgX4Q7AssDihog4ywSh1zkMuiDKp4lZplKPvpHsoz0L9mxpsNdc0g3iyeZEnKV3c5RPDwh6rA1QlN7Cng7e8j-TJB2mMPMy5HY5tfY5bRazQWc0DSOQR8gvnuUB1khU_8f9w7GJC6LnEqio-HbGXuzbh993BoEJpG4QbBUIopePc" />
                                                    <AvatarFallback className="text-[8px]">TM</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <span className="text-[10px] text-slate-400">with Sarah &amp; Tom</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-500/10"></div>
                                        <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-2 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Pick up groceries</h4>
                                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded uppercase tracking-wider hover:bg-orange-100 dark:hover:bg-orange-900/40">Personal</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">5:00 PM - 5:45 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Tomorrow</h3>
                        <div className="space-y-1">
                            <div className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full bg-purple-500 ring-4 ring-purple-500/10"></div>
                                        <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-2 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Review Design System</h4>
                                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-900/40">Project</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">10:00 AM - 11:00 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-500/10"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">Team Lunch</h4>
                                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded uppercase tracking-wider hover:bg-green-100 dark:hover:bg-green-900/40">Social</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">12:30 PM - 1:30 PM</p>
                                        <div className="mt-3">
                                            <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800 rounded-xl p-2">
                                                <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                                                <span className="text-[10px] text-slate-500 truncate">Mediterranean Grill, 5th Ave</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                <Button
                    onClick={openModal}
                    variant="outline"
                    className="w-full py-6 border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary transition-all rounded-2xl text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 h-auto text-base"
                >
                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                    Quick Add Task
                </Button>
            </div>
        </aside>
    );
}
