import { ReactNode } from 'react';

interface PageBackgroundProps {
    children: ReactNode;
    variant?: 'blue' | 'cyan' | 'mixed';
}

export default function PageBackground({ children, variant = 'blue' }: PageBackgroundProps) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Gradient Blobs */}
            {variant === 'blue' && (
                <>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
                </>
            )}

            {variant === 'cyan' && (
                <>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
                </>
            )}

            {variant === 'mixed' && (
                <>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
                    <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-indigo-500/8 blur-[100px] rounded-full pointer-events-none" />
                </>
            )}

            {children}
        </div>
    );
}
