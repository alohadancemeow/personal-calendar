import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Login() {
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-6 bg-grid">
            <Button
                variant="outline"
                size="icon"
                className="fixed top-6 right-6 rounded-full bg-white dark:bg-zinc-800 shadow-md border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:scale-110 transition-transform h-10 w-10"
                onClick={toggleDarkMode}
            >
                <span className="material-icons-round text-xl">dark_mode</span>
            </Button>
            <div className="w-full max-w-[440px]">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-orange-500/20 mb-4">
                        <span className="material-icons-round text-white text-3xl">calendar_today</span>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your schedule with ease</p>
                </div>
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 soft-shadow">
                    <CardContent className="p-0">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</Label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xl pointer-events-none">mail_outline</span>
                                    <Input id="email" type="email" placeholder="stephen@example.com" required className="pl-10 py-6 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</Label>
                                    <a className="text-sm font-semibold text-primary hover:text-orange-600 transition-colors" href="#">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xl pointer-events-none">lock_open</span>
                                    <Input id="password" type="password" placeholder="••••••••" required className="pl-10 pr-12 py-6 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary dark:text-white" />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" type="button">
                                        <span className="material-icons-round text-xl">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary dark:bg-zinc-800" />
                                <Label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400 font-normal cursor-pointer select-none">Remember this device</Label>
                            </div>
                            <Button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] text-base" type="submit">
                                Log In
                            </Button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="flex items-center justify-center gap-2 py-6 border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors h-auto" type="button">
                                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnnhPL7fROZ6EPPuR4ZN-R6Za7RW4BUVu7QwExp3BcWm2tt5aoQ8BFskw29ewtR9UbNOnCGRPP-LgSuXz3ZSmrwBuXJqbz8C7HHYCW1bpGwcl3QHMlEk11ILX-kc6S-IpgGBkM00GoRD-DNj0iefACLcp8r8rA6FnL8Na1YHaGgd1jg5q5JZPPM9t1B5q8w8d64yQaYJmid7RqbJWlZQYwjLnrJW-2g5mDE7s08NpuyTbzdMUlinYy2M4n1HPzD2YdN_VL53qxJOY" />
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Google</span>
                                </Button>
                                <Button variant="outline" className="flex items-center justify-center gap-2 py-6 border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors h-auto" type="button">
                                    <img alt="GitHub" className="w-5 h-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiFfkWossBcnfX7IsT8HYFDw6eMkPcsfuvqiukxNwE88z5WDN714C1WVz0BJEXKKC1WbmiMhsPN3wvnJrYR8k5jFFrFUc7wTvnxVLF9eO3ld0kDyL3567dQtOCxGLLpacQjzD_bsZVj8bL0rcwEbye7bOAtFgznkQaZBmcdkYGiOhHPZ5521DE9nk3pTKM2_aoUjORxXBfe3R9LFc8IqiLamKMuG413YMVj3ONpbg6GIUu8rT2bN7KoolE2xOkbCPf_Soy9Erbksw" />
                                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">GitHub</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <p className="mt-8 text-center text-zinc-600 dark:text-zinc-400">
                    Don't have an account?
                    <Link to="/signup" className="font-bold text-primary hover:text-orange-600 transition-colors ml-1">Create account</Link>
                </p>
            </div>
        </div>
    );
}
