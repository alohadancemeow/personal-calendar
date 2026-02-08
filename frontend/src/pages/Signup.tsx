import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Signup() {
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4">
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-6 right-6 p-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full shadow-lg text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform h-12 w-12"
                onClick={toggleDarkMode}
            >
                <span className="material-icons-outlined block dark:hidden">dark_mode</span>
                <span className="material-icons-outlined hidden dark:block text-orange-400">light_mode</span>
            </Button>

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                        <span className="material-icons-outlined text-white text-3xl">calendar_today</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Join Stephen and thousands of others managing their time better.</p>
                </div>
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <CardContent className="p-0">
                        <form className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</Label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">person</span>
                                    <Input id="name" type="text" placeholder="Stephen Doe" required className="pl-10 py-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</Label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">alternate_email</span>
                                    <Input id="email" type="email" placeholder="stephen@example.com" required className="pl-10 py-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</Label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">lock</span>
                                    <Input id="password" type="password" placeholder="••••••••" required className="pl-10 py-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm Password</Label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">verified_user</span>
                                    <Input id="password_confirmation" type="password" placeholder="••••••••" required className="pl-10 py-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="flex items-start px-1 pt-1 space-x-3">
                                <Checkbox id="terms" className="mt-0.5 border-slate-300 dark:border-slate-600 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" />
                                <Label htmlFor="terms" className="text-sm text-slate-500 dark:text-slate-400 font-normal leading-tight">
                                    I agree to the <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>
                                </Label>
                            </div>
                            <Button className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-primary/25 transform transition active:scale-95 flex items-center justify-center space-x-2 text-base" type="submit">
                                <span>Create Account</span>
                                <span className="material-icons-outlined text-lg">arrow_forward</span>
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white dark:bg-[#1a2236] text-slate-500 rounded-full">Or register with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="flex items-center justify-center py-6 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-auto">
                                <img alt="Google Logo" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXU0me6IgDiAyN1bTkmOvKHbY8fM7xft4I8eaxF6ZdcM8ZcPBCBN5dWOGVmNkl8L9eTZ4NjV77dZ4SgiAiT_o4mu0uYSSZ0vYPGvZJrHbpjf8WcaD-2z7Q7GGj7HQBZXRonTA3BkZVwzRMoNPDyXzlY0NNG-ryPF7DIDRKrOJSZossW--XTARnnJvAJHMgfQJqEPbOlfcxZdG1EslhXHwq9YiLOTahZhdol8HwvKVcoaH8DzcGhux4wS3NG_pNaS_MNrFcDPUnnMs" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center py-6 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-auto">
                                <img alt="Apple Logo" className="h-5 w-5 mr-2 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT_Rq5cjxxn1-rssBXHqviESF29_Ttn0g1pOMqX5bLcDFPjdfZGPm0943VQLFaweHK9lgbJs8F6kSHAIS13JMh9T_qaN-64Sls4c43lThor73nxv0YwTLCVyJkFmzqYKXTHh03G6qWHL5oCoxrENp-igPvjzSeh03NTBSKYQgklhhppwtlVzDnJAbdp6fhfACXaR8W71imKApvHRAMDc5v0uFhffPhkzEPB0pdSQ8Gxm79U032vLagDcT-2AvER2RboU1YwwJwXNc" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Apple</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
                    Already have an account?
                    <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1">Log in here</Link>
                </p>
            </div>
        </div>
    );
}
