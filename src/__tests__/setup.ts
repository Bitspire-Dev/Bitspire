import "@testing-library/jest-dom/vitest";
import React from "react";

// ── Globalny cleanup między testami ──────────────────────────────
beforeEach(() => {
    vi.clearAllMocks();
});

// ── Stuby dla API niedostępnych w jsdom ─────────────────────────
vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
});
vi.stubGlobal("cancelAnimationFrame", vi.fn());

if (typeof navigator !== "undefined") {
    Object.defineProperty(navigator, "clipboard", {
        value: {
            writeText: vi.fn().mockResolvedValue(undefined),
            readText: vi.fn().mockResolvedValue(""),
        },
        writable: true,
        configurable: true,
    });
}

// ── Mock next/navigation ────────────────────────────────────────
vi.mock("next/navigation", () => ({
    usePathname: vi.fn(() => "/"),
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    notFound: vi.fn(),
    redirect: vi.fn(),
}));

// ── Mock next-intl ──────────────────────────────────────────────
vi.mock("next-intl", () => ({
    useLocale: vi.fn(() => "pl"),
    useTranslations: vi.fn(() => (key: string) => key),
}));

// ── Mock next/image (React.createElement, nie DOM element) ──────
vi.mock("next/image", () => ({
    default: ({
        src,
        alt,
        width,
        height,
        fill: _fill,
        priority: _priority,
        blurDataURL: _blurDataURL,
        unoptimized: _unoptimized,
        placeholder: _placeholder,
        loader: _loader,
        quality: _quality,
        ...rest
    }: Record<string, unknown>) => React.createElement("img", { src, alt, width, height, ...rest }),
}));

// ── Mock next/link ──────────────────────────────────────────────
vi.mock("next/link", () => ({
    default: ({ children, href, prefetch: _prefetch, ...rest }: Record<string, unknown>) =>
        React.createElement("a", { href, ...rest }, children as React.ReactNode),
}));

// ── Mock framer-motion (forwardRef, poprawne React elementy) ────
vi.mock("framer-motion", async () => {
    const actual = await vi.importActual("framer-motion");
    const tags = [
        "div", "span", "section", "ul", "li", "button", "a", "p",
        "h1", "h2", "h3", "h4", "nav", "footer", "header", "article", "aside",
        "main", "form", "img", "svg", "path",
    ];
    const motion = Object.fromEntries(
        tags.map((tag) => [
            tag,
            React.forwardRef(
                ({ children, ...props }: Record<string, unknown>, ref: unknown) =>
                    React.createElement(tag, { ...props, ref }, children as React.ReactNode)
            ),
        ])
    );
    return {
        ...actual,
        motion,
        m: motion,
        AnimatePresence: ({ children }: { children: unknown }) => children,
        LazyMotion: ({ children }: { children: unknown }) => children,
        MotionConfig: ({ children }: { children: unknown }) => children,
        domAnimation: {},
    };
});
