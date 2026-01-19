import { tinaField } from 'tinacms/dist/react';

interface BlogHeaderProps {
    title?: string;
    description?: string;
    data?: Record<string, unknown>;
}

export default function BlogHeader({ title, description, data }: BlogHeaderProps) {
    return (
        <header className="mb-10 md:mb-16 text-center" data-tina-field={data ? tinaField(data) : undefined}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-200 text-xs font-bold tracking-widest uppercase font-mono">Blog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight" data-tina-field={data ? tinaField(data, 'title') : undefined}>
                <span className="relative inline-block">
                    {title}
                    <svg className="absolute -bottom-2 left-0 w-full h-2 text-blue-500/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl leading-relaxed" data-tina-field={data ? tinaField(data, 'description') : undefined}>
                {description}
            </p>
        </header>
    );
}
