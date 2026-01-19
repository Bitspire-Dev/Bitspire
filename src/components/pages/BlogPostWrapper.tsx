'use client';

import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { tinaField } from 'tinacms/dist/react';
import PageBackground from '@/components/layout/PageBackground';
import BackLink from '@/components/layout/BackLink';
import FeaturedImage from '@/components/ui/FeaturedImage';
import { RichText } from '@tina/richTextPresets';
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
    body: TinaMarkdownContent | TinaMarkdownContent[];
    locale?: string;
    slug?: string;
    relatedPosts?: Array<{
        title: string;
        slug: string;
        excerpt?: string;
        image?: string;
        date?: string;
        readTime?: number | null;
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
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-16 md:pt-28 pb-16 md:pb-20">
                <BackLink
                    href="/blog"
                    label={data?.blog?.backToBlog}
                    tinaField={data ? tinaField(data, 'blog.backToBlog') : undefined}
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Main Content */}
                    <main className="min-w-0">
                        <article className="w-full max-w-none">
                            {/* Featured Image - 16:9 aspect ratio */}
                            {data.image && (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 md:mb-12 shadow-2xl">
                                    <FeaturedImage
                                        src={data.image}
                                        alt={data.imageAlt || data.title}
                                        className="absolute inset-0 w-full h-full"
                                        tinaField={tinaField(data, 'image')}
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
                                    translations={data?.blog}
                                    translationsTinaFields={data ? {
                                        by: tinaField(data, 'blog.by'),
                                        readTime: tinaField(data, 'blog.readTime'),
                                        publishedOn: tinaField(data, 'blog.publishedOn'),
                                    } : undefined}
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
                        <div className="mt-10 space-y-6 lg:hidden">
                            <AuthorBox 
                                author={data.author} 
                                authorBox={data?.blog?.authorBox}
                                tinaFields={data ? {
                                    author: tinaField(data, 'author'),
                                    title: tinaField(data, 'blog.authorBox.title'),
                                    bio: tinaField(data, 'blog.authorBox.bio'),
                                    contact: tinaField(data, 'blog.authorBox.contact'),
                                } : undefined}
                            />
                            <ShareButtons 
                                title={data?.blog?.shareTitle}
                                buttons={data?.blog?.shareButtons}
                                tinaFields={data ? {
                                    title: tinaField(data, 'blog.shareTitle'),
                                    twitter: tinaField(data, 'blog.shareButtons.twitter'),
                                    linkedin: tinaField(data, 'blog.shareButtons.linkedin'),
                                    facebook: tinaField(data, 'blog.shareButtons.facebook'),
                                    copy: tinaField(data, 'blog.shareButtons.copyLink'),
                                } : undefined}
                            />
                            <TableOfContents 
                                title={data?.blog?.tableOfContentsTitle}
                                locale={locale} 
                                tinaField={data ? tinaField(data, 'blog.tableOfContentsTitle') : undefined}
                            />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="hidden lg:block space-y-6">
                        <AuthorBox 
                            author={data.author} 
                            authorBox={data?.blog?.authorBox}
                            tinaFields={data ? {
                                author: tinaField(data, 'author'),
                                title: tinaField(data, 'blog.authorBox.title'),
                                bio: tinaField(data, 'blog.authorBox.bio'),
                                contact: tinaField(data, 'blog.authorBox.contact'),
                            } : undefined}
                        />
                        <ShareButtons 
                            title={data?.blog?.shareTitle}
                            buttons={data?.blog?.shareButtons}
                            tinaFields={data ? {
                                title: tinaField(data, 'blog.shareTitle'),
                                twitter: tinaField(data, 'blog.shareButtons.twitter'),
                                linkedin: tinaField(data, 'blog.shareButtons.linkedin'),
                                facebook: tinaField(data, 'blog.shareButtons.facebook'),
                                copy: tinaField(data, 'blog.shareButtons.copyLink'),
                            } : undefined}
                        />
                        <div className="sticky top-28 pr-1">
                            <TableOfContents 
                                title={data?.blog?.tableOfContentsTitle}
                                locale={locale} 
                                tinaField={data ? tinaField(data, 'blog.tableOfContentsTitle') : undefined}
                            />
                        </div>
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
                    readMoreLabel={data?.blog?.readMore}
                    readTimeLabel={data?.blog?.readTime}
                    tinaFields={data ? {
                        sectionTitle: tinaField(data, 'blog.relatedArticlesTitle'),
                        readMoreLabel: tinaField(data, 'blog.readMore'),
                        readTimeLabel: tinaField(data, 'blog.readTime'),
                    } : undefined}
                />
            )}
        </PageBackground>
    );
}
