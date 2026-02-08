import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import CreateEventModal from '../components/CreateEventModal';
import { useModalStore } from '@/store/modal';

export default function DashboardLayout() {
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200 flex flex-col">
            <Header />
            <main className="flex h-[calc(100vh-73px)] overflow-hidden max-w-[1536px] w-full mx-auto">
                <LeftSidebar />
                <div className="flex-1 overflow-hidden flex">
                    <Outlet context={{ openModal }} />
                </div>
            </main>
            <CreateEventModal />
        </div>
    );
}
