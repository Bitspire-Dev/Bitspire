'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { tinaField } from 'tinacms/dist/react';
import PageBackground from '@/components/layout/PageBackground';
import BackLink from '@/components/layout/BackLink';
import FeaturedImage from '@/components/ui/FeaturedImage';
import BlogPostHeader from '@/components/sections/blog/BlogPostHeader';
import TableOfContents from '@/components/sections/blog/TableOfContents';
import AuthorBox from '@/components/sections/blog/AuthorBox';
import ShareButtons from '@/components/sections/blog/ShareButtons';
import ReadingProgressBar from '@/components/sections/blog/ReadingProgressBar';
import { RelatedArticles } from '@/components/sections/blog/RelatedArticles';

interface BlogPostData {
    title: string;
    description: string;
    date: string;
    author: string;
    category?: string | null;
    tags?: (string | null)[] | null;
    image?: string | null;
    imageAlt?: string | null;
    readTime?: number | null;
    body: Record<string, unknown>;
    locale?: string;
    slug?: string;
    relatedPosts?: Array<{
        title: string;
        slug: string;
        excerpt?: string;
        image?: string;
        date?: string;
        readTime?: string;
    }>;
    blog?: {
        noArticles?: string;
        readMore?: string;
        readTime?: string;
        by?: string;
        backToBlog?: string;
        publishedOn?: string;
        shareTitle?: string;
        shareButtons?: {
            twitter?: string;
            linkedin?: string;
            facebook?: string;
            copyLink?: string;
        };
        tableOfContentsTitle?: string;
        authorBox?: {
            title?: string;
            bio?: string;
            contact?: string;
        };
        relatedArticlesTitle?: string;
    } | null;
    [key: string]: unknown;
}

interface BlogPostWrapperProps {
    data: BlogPostData;
}

export default function BlogPostWrapper({ data }: BlogPostWrapperProps) {
    const locale = data?.locale || 'pl';

    return (
        <PageBackground variant="blue">
            <ReadingProgressBar />
            <div className="relative z-10 w-full max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-32 pb-20">
                <BackLink href="/blog" label={data?.blog?.backToBlog} />

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
                    {/* Main Content */}
                    <main className="min-w-0">
                        <article className="max-w-4xl">
                            <BlogPostHeader
                                title={data.title}
                                description={data.description}
                                category={data.category}
                                readTime={data.readTime}
                                author={data.author}
                                date={data.date}
                                locale={locale}
                                data={data}
                                translations={data?.blog}
                            />

                            {/* Featured Image - 16:9 aspect ratio */}
                            {data.image && (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-2xl">
                                    <FeaturedImage
                                        src={data.image}
                                        alt={data.imageAlt || data.title}
                                        className="absolute inset-0 w-full h-full"
                                        tinaField={tinaField(data, 'image')}
                                    />
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="prose prose-invert prose-xl max-w-none wrap-break-word overflow-wrap-anywhere
                                prose-headings:font-bold prose-headings:tracking-tight prose-headings:leading-tight prose-headings:scroll-mt-28 prose-headings:break-words
                                prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-700/30 prose-h2:text-white
                                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-slate-100
                                prose-h4:text-xl prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-slate-200
                                prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg prose-p:break-words
                                prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline prose-a:transition-colors
                                prose-strong:text-white prose-strong:font-bold
                                prose-em:text-slate-300 prose-em:italic
                                prose-ul:my-8 prose-ul:space-y-3 prose-ul:text-slate-300 prose-ul:text-lg
                                prose-ol:my-8 prose-ol:space-y-3 prose-ol:text-slate-300 prose-ol:text-lg
                                prose-li:text-slate-300 prose-li:leading-[1.8] prose-li:my-2
                                prose-li:marker:text-blue-400 prose-li:marker:font-bold
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-8 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-300 prose-blockquote:text-lg prose-blockquote:break-words
                                prose-code:text-blue-300 prose-code:bg-slate-800/70 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm md:prose-code:text-base prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-[''] prose-code:break-all
                                prose-pre:bg-slate-900/70 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl md:prose-pre:rounded-2xl prose-pre:py-5 prose-pre:px-8 sm:prose-pre:py-6 sm:prose-pre:px-10 md:prose-pre:py-8 md:prose-pre:px-12 lg:prose-pre:p-12 prose-pre:my-10 prose-pre:shadow-2xl prose-pre:overflow-x-auto prose-pre:text-xs md:prose-pre:text-sm prose-pre:max-w-full
                                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12 prose-img:max-w-full prose-img:h-auto
                                prose-hr:border-slate-700/30 prose-hr:my-16 prose-hr:border-t-2
                                prose-table:border-collapse prose-table:w-full prose-table:my-10 prose-table:table-auto prose-table:overflow-x-auto prose-table:block sm:prose-table:table
                                prose-th:bg-slate-800/70 prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-slate-700/50 prose-th:font-bold prose-th:text-slate-100 prose-th:break-words
                                prose-td:p-4 prose-td:border prose-td:border-slate-700/30 prose-td:text-slate-300 prose-td:break-words
                                first:prose-p:text-xl first:prose-p:leading-[1.9] first:prose-p:text-slate-200
                            ">
                                <TinaMarkdown content={data.body} />
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
                    </main>

                    {/* Sidebar */}
                    <aside className="space-y-6 hidden lg:block">
                        <AuthorBox 
                            author={data.author} 
                            authorBox={data?.blog?.authorBox}
                            locale={locale} 
                        />
                        <ShareButtons 
                            title={data?.blog?.shareTitle}
                            buttons={data?.blog?.shareButtons}
                            locale={locale} 
                        />
                        <TableOfContents 
                            title={data?.blog?.tableOfContentsTitle}
                            locale={locale} 
                        />
                    </aside>
                </div>
            </div>

            {/* Related Articles */}
            {data.relatedPosts && data.relatedPosts.length > 0 && (
                <RelatedArticles
                    articles={data.relatedPosts}
                    currentSlug={data.slug || ''}
                    locale={locale}
                    type="blog"
                    sectionTitle={data?.blog?.relatedArticlesTitle}
                />
            )}
        </PageBackground>
    );
}
