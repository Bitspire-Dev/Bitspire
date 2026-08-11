import type { BlogPostData } from '@/lib/tina/types';
import { tinaField } from 'tinacms/dist/react';
import PageBackground from '@/components/layout/PageBackground';
import BackLink from '@/components/layout/BackLink';
import FeaturedImage from '@/components/ui/media/FeaturedImage';
import { RichText } from '@tina/richTextPresets';
import BlogPostHeader from '@/components/sections/blog/BlogPostHeader';
import { getBlogUiCopy } from '@/lib/ui/blogCopy';
import { safeImageSrc } from '@/lib/ui/helpers';
import { BlogPostDesktopSidebar, BlogPostMobileSidebar, BlogPostProgress, BlogPostRelated } from '@/components/pages/BlogPostClient';
import type { AdminLinkMode } from '@/lib/routing/adminLink';

interface BlogPostWrapperProps {
    data: BlogPostData;
    linkMode?: AdminLinkMode;
}

export default function BlogPostWrapper({ data, linkMode = 'production' }: BlogPostWrapperProps) {
    const locale = data?.locale || 'pl';
    const copy = getBlogUiCopy(locale);
    const imageSrc = safeImageSrc(data.image);
    const unoptimizedImage = Boolean(imageSrc && imageSrc.startsWith('/') && imageSrc.endsWith('.avif'));

    return (
        <PageBackground variant="blue">
            <BlogPostProgress />
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-16 md:pt-28 pb-16 md:pb-20">
                <BackLink
                    href="/blog"
                    label={copy.backToBlog}
                    locale={locale}
                    linkMode={linkMode}
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Main Content */}
                    <main className="min-w-0">
                        <article className="w-full max-w-none">
                            {/* Featured Image - 16:9 aspect ratio */}
                            {imageSrc && (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 md:mb-12 shadow-2xl">
                                    <FeaturedImage
                                        src={imageSrc}
                                        alt={data.imageAlt || data.title}
                                        className="w-full h-full object-cover"
                                        tinaField={tinaField(data, 'image')}
                                        width={1280}
                                        height={720}
                                        sizes="100vw"
                                        priority
                                        placeholder="blur"
                                        unoptimized={unoptimizedImage}
                                    />
                                </div>
                            )}

                            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-2xl backdrop-blur-md p-6 sm:p-8 md:p-10">
                                <BlogPostHeader
                                    title={data.title}
                                    description={data.description}
                                    category={data.category}
                                    readTime={data.readTime}
                                    author={data.author}
                                    date={data.date}
                                    locale={locale}
                                    data={data}
                                    translations={{
                                        by: copy.by,
                                        readTime: copy.readTime,
                                        publishedOn: copy.publishedOn,
                                    }}
                                    authorTinaField={data ? tinaField(data, 'author') : undefined}
                                />

                                {/* Article Content */}
                                <div data-tina-field={tinaField(data, 'body')} data-toc-content>
                                    <RichText content={data.body} preset="body" />
                                </div>
                            </div>

                            {/* Tags */}
                            {data.tags && data.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-slate-700/50">
                                    <div className="flex flex-wrap gap-2">
                                        {data.tags.filter(tag => tag).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-sm text-slate-400 bg-slate-800/50 rounded-full border border-slate-700/50 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* Mobile: Share + TOC below article */}
                        <BlogPostMobileSidebar data={data} copy={copy} />
                    </main>

                    {/* Sidebar */}
                    <BlogPostDesktopSidebar data={data} copy={copy} />
                </div>
            </div>

            {/* Related Articles */}
            <BlogPostRelated data={data} copy={copy} />
        </PageBackground>
    );
}
