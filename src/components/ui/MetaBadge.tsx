interface MetaBadgeProps {
    label: string;
    variant?: 'blue' | 'cyan' | 'slate';
    tinaField?: string;
}

export default function MetaBadge({ label, variant = 'blue', tinaField }: MetaBadgeProps) {
    const variantClasses = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        slate: 'text-slate-400 bg-slate-800 border-slate-700'
    };
    
    return (
        <span 
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${variantClasses[variant]}`}
            data-tina-field={tinaField}
        >
            {label}
        </span>
    );
}
