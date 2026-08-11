import BlogCard from './BlogCard';
import { getBlogUiCopy } from '@/lib/ui/blogCopy';

interface BlogPost {
    _sys: {
        filename: string;
        relativePath: string;
    };
    title: string;
    slug: string;
    description: string;
    excerpt?: string | null;
    date: string;
    author: string;
    category?: string | null;
    tags?: (string | null)[] | null;
    image?: string | null;
    imageAlt?: string | null;
    readTime?: number | null;
}

interface BlogGridProps {
    posts: BlogPost[];
    locale: string;
    getLink: (path: string) => string;
    isAdmin?: boolean;
}

export default function BlogGrid({ posts, locale, getLink, isAdmin = false }: BlogGridProps) {
    const copy = getBlogUiCopy(locale);

    if (posts.length === 0) {
        return (
            <section aria-label="Blog posts" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
                <div className="col-span-full text-center py-16 md:py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-400 text-lg">{copy.noArticles}</p>
                </div>
            </section>
        );
    }

    return (
        <section aria-label="Blog posts" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
            {posts.map((post, index) => (
                <BlogCard
                    key={post._sys.relativePath}
                    title={post.title}
                    slug={post._sys.filename}
                    excerpt={post.excerpt}
                    description={post.description}
                    image={post.image}
                    imageAlt={post.imageAlt}
                    date={post.date}
                    readTime={post.readTime}
                    tags={post.tags}
                    locale={locale}
                    getLink={getLink}
                    isAdmin={isAdmin}
                    priority={index < 2}
                    data={post as unknown as Record<string, unknown>}
                />
            ))}
        </section>
    );
}
