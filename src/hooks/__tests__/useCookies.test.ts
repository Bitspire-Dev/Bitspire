import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock @/lib/cookies
vi.mock("@/lib/cookies", () => ({
    loadConsent: vi.fn(),
    saveConsent: vi.fn((state) => ({ ...state, timestamp: new Date().toISOString() })),
    updateConsent: vi.fn((partial) => ({ necessary: true, analytics: false, personalization: false, marketing: false, ...partial })),
    defaultConsent: { necessary: true, analytics: false, personalization: false, marketing: false },
    COOKIE_CONSENT_NAME: "cookie_consent_v1",
}));

import { loadConsent, saveConsent, updateConsent } from "@/lib/cookies";
import { useCookieConsent } from "@/hooks/useCookies";

describe("useCookieConsent — initialization", () => {
    it("starts with consent = null before mount", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        // After mount, loadConsent was called
        expect(result.current.ready).toBe(true);
    });

    it("consent is null when loadConsent returns null", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.consent).toBeNull();
    });

    it("consent is set when loadConsent returns data", () => {
        const storedConsent = { necessary: true, analytics: true, personalization: false, marketing: false };
        vi.mocked(loadConsent).mockReturnValue(storedConsent);
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.consent).toMatchObject(storedConsent);
    });

    it("ready is true after mount", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.ready).toBe(true);
    });
});

describe("useCookieConsent — grantAll", () => {
    it("calls saveConsent with all true", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        act(() => result.current.grantAll());
        expect(saveConsent).toHaveBeenCalledWith(
            expect.objectContaining({ analytics: true, personalization: true, marketing: true })
        );
    });

    it("updates consent state to all-true", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        vi.mocked(saveConsent).mockReturnValue({
            necessary: true, analytics: true, personalization: true, marketing: true, timestamp: "",
        });
        const { result } = renderHook(() => useCookieConsent());
        act(() => result.current.grantAll());
        expect(result.current.consent?.analytics).toBe(true);
    });
});

describe("useCookieConsent — rejectAll", () => {
    it("calls saveConsent with all optional categories false", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        act(() => result.current.rejectAll());
        expect(saveConsent).toHaveBeenCalledWith(
            expect.objectContaining({ necessary: true, analytics: false, personalization: false, marketing: false })
        );
    });
});

describe("useCookieConsent — setCategories", () => {
    it("does not change 'necessary' category", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        vi.mocked(updateConsent).mockReturnValue({
            necessary: true, analytics: true, personalization: false, marketing: false,
        });
        const { result } = renderHook(() => useCookieConsent());
        act(() => result.current.setCategories(["necessary", "analytics"], true));
        expect(updateConsent).toHaveBeenCalledWith(expect.not.objectContaining({ necessary: expect.anything() }));
    });

    it("calls updateConsent with selected categories set to value", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        act(() => result.current.setCategories(["analytics"], true));
        expect(updateConsent).toHaveBeenCalledWith(expect.objectContaining({ analytics: true }));
    });
});

describe("useCookieConsent — hasConsent", () => {
    it("always returns true for 'necessary'", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.hasConsent("necessary")).toBe(true);
    });

    it("returns false for 'analytics' when consent is null", () => {
        vi.mocked(loadConsent).mockReturnValue(null);
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.hasConsent("analytics")).toBe(false);
    });

    it("returns true for 'analytics' when consent has analytics = true", () => {
        vi.mocked(loadConsent).mockReturnValue({ necessary: true, analytics: true, personalization: false, marketing: false });
        const { result } = renderHook(() => useCookieConsent());
        expect(result.current.hasConsent("analytics")).toBe(true);
    });
});
