import Image from 'next/image';

const DEFAULT_BLUR_DATA_URL =
    'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

interface FeaturedImageProps {
    src: string;
    alt: string;
    className?: string;
    tinaField?: string;
    sizes?: string;
    priority?: boolean;
    fill?: boolean;
    width?: number;
    height?: number;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
}

export default function FeaturedImage({
    src,
    alt,
    className = '',
    tinaField,
    sizes,
    priority,
    fill,
    width,
    height,
    quality,
    placeholder,
    blurDataURL,
    unoptimized,
}: FeaturedImageProps) {
    const hasDimensions = typeof width === 'number' && typeof height === 'number';
    const useFill = typeof fill === 'boolean' ? fill : !hasDimensions;
    const resolvedPlaceholder = placeholder ?? (priority ? 'blur' : 'empty');
    const resolvedBlurDataURL =
        resolvedPlaceholder === 'blur' ? blurDataURL ?? DEFAULT_BLUR_DATA_URL : undefined;

    return (
        <Image
            src={src}
            alt={alt}
            fill={useFill}
            width={useFill ? undefined : width}
            height={useFill ? undefined : height}
            sizes={sizes ?? (useFill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
            className={className}
            priority={priority}
            quality={quality}
            placeholder={resolvedPlaceholder}
            blurDataURL={resolvedBlurDataURL}
            unoptimized={unoptimized}
            data-tina-field={tinaField}
        />
    );
}
