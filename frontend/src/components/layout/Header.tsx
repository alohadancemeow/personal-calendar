import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";

export default function Header() {
    const user = useAuthStore(state => state.user);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    };

    return (
        <header className="border-b border-slate-200 dark:border-slate-800 bg-card-light dark:bg-card-dark sticky top-0 z-50">
            <div className="max-w-[1536px] mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-xl font-bold tracking-tight">Calendar</span>
                    </Link>
                    <nav className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <Button variant="secondary" size="sm" className="h-8 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600">Day</Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-all">Week</Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-all">Month</Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-700 transition-all">Year</Button>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800">
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors h-10 w-10" onClick={toggleDarkMode}>
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">dark_mode</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors h-10 w-10">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">notifications</span>
                        </Button>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date().getHours() < 12
                                        ? 'Good morning'
                                        : new Date().getHours() < 18
                                            ? 'Good afternoon'
                                            : 'Good evening'
                                    }
                                </p>
                                <p className="text-sm font-bold">{user?.username}</p>
                            </div>
                            <Link to="/settings">
                                <Avatar className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
                                    <AvatarImage src={`${user?.image}`} />
                                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="default" size="sm" className="h-8 cursor-pointer rounded-lg text-sm font-medium">Login</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
