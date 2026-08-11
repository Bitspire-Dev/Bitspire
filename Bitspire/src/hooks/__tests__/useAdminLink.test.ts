import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// Mocks for next/navigation and next-intl
const mockUsePathname = vi.fn(() => "/");
const mockUseLocale = vi.fn(() => "pl");

vi.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));
vi.mock("next-intl", () => ({
    useLocale: () => mockUseLocale(),
}));

// Mock adminLink lib
vi.mock("@/lib/routing/adminLink", () => ({
    isAdminPath: vi.fn((pathname: string) => pathname?.startsWith("/admin/")),
    buildAdminLink: vi.fn((href: string, ctx: { locale: string; pathname?: string }) => {
        if (ctx.pathname?.startsWith("/admin/")) return `/admin/${ctx.locale}${href}`;
        return `/${ctx.locale}${href}`;
    }),
}));

import { useAdminLink } from "@/hooks/useAdminLink";

describe("useAdminLink — production mode", () => {
    it("isAdmin is false when pathname is not an admin path", () => {
        mockUsePathname.mockReturnValue("/portfolio");
        const { result } = renderHook(() => useAdminLink());
        expect(result.current.isAdmin).toBe(false);
    });

    it("getLink builds production path", () => {
        mockUsePathname.mockReturnValue("/portfolio");
        mockUseLocale.mockReturnValue("pl");
        const { result } = renderHook(() => useAdminLink());
        const link = result.current.getLink("/portfolio");
        expect(link).toContain("portfolio");
    });
});

describe("useAdminLink — admin mode", () => {
    it("isAdmin is true when pathname starts with /admin/", () => {
        mockUsePathname.mockReturnValue("/admin/pl/home");
        const { result } = renderHook(() => useAdminLink());
        expect(result.current.isAdmin).toBe(true);
    });

    it("getLink returns admin-prefixed path", () => {
        mockUsePathname.mockReturnValue("/admin/pl/home");
        mockUseLocale.mockReturnValue("pl");
        const { result } = renderHook(() => useAdminLink());
        const link = result.current.getLink("/portfolio");
        expect(link).toContain("/admin/pl");
        expect(link).toContain("portfolio");
    });
});
