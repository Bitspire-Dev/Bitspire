interface FeaturedImageProps {
    src: string;
    alt: string;
    className?: string;
    tinaField?: Record<string, unknown>;
}

export default function FeaturedImage({ src, alt, className = '', tinaField }: FeaturedImageProps) {
    return (
        <div 
            className={`bg-cover bg-center bg-no-repeat ${className}`}
            data-tina-field={tinaField}
            style={{
                backgroundImage: `url(${src})`,
            }}
            role="img"
            aria-label={alt}
        />
    );
}
