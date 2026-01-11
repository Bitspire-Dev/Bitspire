'use client';

import React, { useEffect, useState } from 'react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    title?: string;
    locale?: string;
}

export default function TableOfContents({ title, locale: _locale = 'pl' }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from the article content
        const articleElement = document.querySelector('article .prose');
        if (!articleElement) return;

        const headingElements = articleElement.querySelectorAll('h2, h3');
        const extractedHeadings: Heading[] = [];

        headingElements.forEach((heading, index) => {
            // Generate ID if it doesn't exist
            let id = heading.id;
            if (!id) {
                // Create slug from heading text
                const text = heading.textContent || '';
                id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9ąćęłńóśźż\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                
                // Fallback if empty
                if (!id) {
                    id = `heading-${index}`;
                }
                heading.id = id;
            }

            extractedHeadings.push({
                id,
                text: heading.textContent || '',
                level: parseInt(heading.tagName.substring(1)),
            });
        });

        setHeadings(extractedHeadings);

        // Intersection Observer for active heading
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            // Find the first visible heading
            const visibleHeadings = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => {
                    return a.boundingClientRect.top - b.boundingClientRect.top;
                });

            if (visibleHeadings.length > 0) {
                setActiveId(visibleHeadings[0].target.id);
            }
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-80px 0px -80% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1],
        });

        headingElements.forEach((heading) => {
            observer.observe(heading);
        });

        return () => {
            headingElements.forEach((heading) => {
                observer.unobserve(heading);
            });
        };
    }, []);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav
            aria-label={title}
        >
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm shadow-lg">
                <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-4">
                    {title}
                </h2>
                <ol className="space-y-0.5 text-sm">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={heading.level === 3 ? 'pl-3' : ''}
                        >
                            <a
                                href={`#${heading.id}`}
                                className={`block py-2 px-3 -mx-3 rounded-lg transition-all duration-200 leading-snug ${
                                    activeId === heading.id
                                        ? 'text-blue-400 font-semibold bg-linear-to-r from-blue-500/20 to-cyan-500/10 border-l-2 border-blue-400 pl-2.5'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(heading.id);
                                    if (element) {
                                        const offset = 100;
                                        const elementPosition = element.getBoundingClientRect().top;
                                        const offsetPosition = elementPosition + window.scrollY - offset;

                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
