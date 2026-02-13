interface Location {
    type: string;
    platform?: string;
    address?: string;
    link?: string;
}

interface LocationDetailsProps {
    location: Location;
}

export default function LocationDetails({ location }: LocationDetailsProps) {
    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Location</h4>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        {location.type === 'online' ? 'videocam' : 'location_on'}
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold">
                        {location.type === 'online' ? location.platform : location.address}
                    </p>
                    {location.type === 'online' && location.link && (
                        <a
                            className="text-xs text-primary hover:underline block break-all whitespace-pre-wrap"
                            href={location.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {location.link}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
