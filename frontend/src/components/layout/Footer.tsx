
export default function Footer() {
    return (
        <footer className="p-4 text-center text-xs text-slate-400 dark:text-slate-600">
            <p>&copy; {new Date().getFullYear()} Personal Calendar.</p>
        </footer>
    );
}
