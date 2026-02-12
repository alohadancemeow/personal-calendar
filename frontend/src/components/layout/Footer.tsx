
export default function Footer() {
    return (
        <footer className="py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-600 space-y-2">
            <p className="text-xs">
                8 AM — 6 PM Calendar <br />
                Focus on what matters during the day, <br /> Rest in the evening.
            </p>
            <p className="opacity-70">&copy; {new Date().getFullYear()} Built with 🧡 React + FastAPI.</p>
        </footer>
    );
}
