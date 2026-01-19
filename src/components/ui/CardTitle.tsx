import type { ReactNode } from 'react';

interface CardTitleProps {
    children: ReactNode;
    variant?: 'blue' | 'cyan';
    className?: string;
    tinaField?: string;
}

export default function CardTitle({
    children,
    variant = 'blue',
    className = '',
    tinaField
}: CardTitleProps) {
    const variantClasses = {
        blue: 'group-hover:from-blue-400 group-hover:to-cyan-400',
        cyan: 'group-hover:from-cyan-400 group-hover:to-blue-400'
    };

    return (
        <h2
            className={`text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r transition-all duration-300 mb-4 leading-tight ${variantClasses[variant]} ${className}`}
            data-tina-field={tinaField}
        >
            {children}
        </h2>
    );
}
