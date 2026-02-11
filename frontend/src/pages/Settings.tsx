import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 w-full overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and calendar preferences.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 space-y-1">
                    <Button
                        variant={activeTab === 'profile' ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 font-semibold ${activeTab === 'profile' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-slate-600 dark:text-slate-400'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="material-symbols-outlined">person</span>
                        Profile Information
                    </Button>
                    <Button
                        variant={activeTab === 'security' ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 font-semibold ${activeTab === 'security' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-slate-600 dark:text-slate-400'}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <span className="material-symbols-outlined">security</span>
                        Security &amp; Password
                    </Button>
                    <Button
                        variant={activeTab === 'preferences' ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 font-semibold ${activeTab === 'preferences' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-slate-600 dark:text-slate-400'}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <span className="material-symbols-outlined">tune</span>
                        Calendar Preferences
                    </Button>
                    <Button
                        variant={activeTab === 'notifications' ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 font-semibold ${activeTab === 'notifications' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-slate-600 dark:text-slate-400'}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        Notifications
                    </Button>

                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <Button onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                            variant="ghost"
                            className="w-full cursor-pointer justify-start gap-3 h-12 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Sign Out
                        </Button>
                    </div>
                </aside>

                <div className="flex-1 space-y-8 pb-10">
                    <Card className="border-slate-200 dark:border-slate-800 settings-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">contact_page</span>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 rounded-2xl ring-4 ring-slate-50 dark:ring-slate-800">
                                        <AvatarImage
                                            src={`${user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB4tiRKuSLvEdDsAQlk5Cre0tNZEZ6lVP5qHNOr2HnqpeQqO_lLCmBLeEG61w1LoI2utdaXwnx9RrHnkl9fc5ZI9jWqapawGsrscrF2pfRbWnAOZkpXauDCb38Y6LhfQeWa3iNyDryVUX5W1z7awikbI4Dw1z8ZZ0kB1nDQZD-IUpethnw42WceSAuKcF-mBxVA342_0sHgma9ixtv6ezvkM8hTwp8M0bVYOq7q3RTxB2HsK89uqDCN9Ka0QQzcqHJI7Ae8niVWi6g"}`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>SO</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </Button>
                                </div>
                                <div>
                                    <h3 className="font-bold">Profile Picture</h3>
                                    <p className="text-sm text-slate-500 mb-2">JPG, GIF or PNG. Max size of 800K</p>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="sm">Upload New</Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">Remove</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 dark:text-slate-400">Full Name</Label>
                                    <Input defaultValue={`${user?.username || "Stephen Oladipo"}`} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 dark:text-slate-400">Email Address</Label>
                                    <Input type="email" defaultValue={`${user?.email}`} value={user?.email} />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-slate-600 dark:text-slate-400">Bio</Label>
                                    <Textarea placeholder="Tell us about yourself..." className="resize-none" rows={3} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 settings-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                Calendar Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-slate-600 dark:text-slate-400 block mb-3">Default Calendar View</Label>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl max-w-sm">
                                    <Button variant="ghost" className="flex-1 py-1 h-9 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-sm font-medium">Day</Button>
                                    <Button variant="ghost" className="flex-1 py-1 h-9 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-sm font-medium">Week</Button>
                                    <Button className="flex-1 py-1 h-9 rounded-lg shadow-sm text-sm font-medium bg-secondary text-secondary-foreground">Month</Button>
                                    <Button variant="ghost" className="flex-1 py-1 h-9 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-sm font-medium">Year</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 dark:text-slate-400">Time Format</Label>
                                    <Select defaultValue="12">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12">12-hour (12:00 PM)</SelectItem>
                                            <SelectItem value="24">24-hour (14:00)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-600 dark:text-slate-400">Week Starts On</Label>
                                    <Select defaultValue="monday">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monday">Monday</SelectItem>
                                            <SelectItem value="sunday">Sunday</SelectItem>
                                            <SelectItem value="saturday">Saturday</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm">Show Week Numbers</p>
                                        <p className="text-xs text-slate-500">Display week count on the left side of the calendar</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm">Events Sound Alerts</p>
                                        <p className="text-xs text-slate-500">Play a sound notification when an event is about to start</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button variant="ghost" size="lg">Cancel</Button>
                        <Button size="lg" className="shadow-lg shadow-primary/20">Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
