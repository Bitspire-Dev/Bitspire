import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    parseConsent,
    serializeConsent,
    defaultConsent,
    loadConsent,
    saveConsent,
    hasAnyConsent,
    updateConsent,
    setCookie,
    getCookie,
    removeCookie,
    COOKIE_CONSENT_NAME,
    type ConsentState,
} from "@/lib/cookies";

// Mock cookies-next
vi.mock("cookies-next", () => ({
    getCookie: vi.fn(),
    setCookie: vi.fn(),
    deleteCookie: vi.fn(),
}));

import { getCookie as getCNext, setCookie as setCNext, deleteCookie as delCNext } from "cookies-next";

describe("defaultConsent", () => {
    it("has necessary: true", () => {
        expect(defaultConsent.necessary).toBe(true);
    });

    it("has all optional categories as false", () => {
        expect(defaultConsent.analytics).toBe(false);
        expect(defaultConsent.personalization).toBe(false);
        expect(defaultConsent.marketing).toBe(false);
    });
});

describe("parseConsent", () => {
    it("returns null for null input", () => {
        expect(parseConsent(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
        expect(parseConsent(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
        expect(parseConsent("")).toBeNull();
    });

    it("parses valid encoded JSON and merges with defaults", () => {
        const state: ConsentState = {
            necessary: true,
            analytics: true,
            personalization: false,
            marketing: false,
        };
        const encoded = encodeURIComponent(JSON.stringify(state));
        const result = parseConsent(encoded);
        expect(result).toMatchObject(state);
    });

    it("merges partial JSON with defaultConsent", () => {
        const partial = { analytics: true };
        const encoded = encodeURIComponent(JSON.stringify(partial));
        const result = parseConsent(encoded);
        expect(result?.necessary).toBe(true);
        expect(result?.analytics).toBe(true);
        expect(result?.personalization).toBe(false);
    });

    it("returns null for invalid JSON", () => {
        expect(parseConsent("not-valid-json")).toBeNull();
    });
});

describe("serializeConsent", () => {
    it("returns a URI-encoded string", () => {
        const state: ConsentState = { necessary: true, analytics: false, personalization: false, marketing: false };
        const result = serializeConsent(state);
        expect(typeof result).toBe("string");
        expect(result).not.toContain("{"); // should be encoded
    });

    it("roundtrips perfectly with parseConsent", () => {
        const state: ConsentState = { necessary: true, analytics: true, personalization: false, marketing: true };
        const serialized = serializeConsent(state);
        const parsed = parseConsent(serialized);
        expect(parsed).toMatchObject(state);
    });
});

describe("setCookie", () => {
    it("calls setCNext with correct options", () => {
        setCookie("my_cookie", "my_value", 30);
        expect(setCNext).toHaveBeenCalledWith(
            "my_cookie",
            "my_value",
            expect.objectContaining({ path: "/", maxAge: 30 * 24 * 60 * 60, sameSite: "lax" })
        );
    });
});

describe("getCookie", () => {
    it("returns string value when cookie exists", () => {
        vi.mocked(getCNext).mockReturnValue("cookie_value");
        expect(getCookie("test")).toBe("cookie_value");
    });

    it("returns undefined when cookie is missing", () => {
        vi.mocked(getCNext).mockReturnValue(undefined);
        expect(getCookie("missing")).toBeUndefined();
    });
});

describe("removeCookie", () => {
    it("calls deleteCookie with name and path", () => {
        removeCookie("my_cookie");
        expect(delCNext).toHaveBeenCalledWith("my_cookie", { path: "/" });
    });
});

describe("loadConsent", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.mocked(getCNext).mockReturnValue(undefined);
    });

    it("returns null when no cookie and no localStorage", () => {
        expect(loadConsent()).toBeNull();
    });

    it("returns consent from cookie when available", () => {
        const state: ConsentState = { necessary: true, analytics: true, personalization: false, marketing: false };
        vi.mocked(getCNext).mockReturnValue(encodeURIComponent(JSON.stringify(state)));
        const result = loadConsent();
        expect(result?.analytics).toBe(true);
    });

    it("falls back to localStorage when no cookie", () => {
        const state: ConsentState = { necessary: true, analytics: false, personalization: true, marketing: false };
        localStorage.setItem(COOKIE_CONSENT_NAME, encodeURIComponent(JSON.stringify(state)));
        vi.mocked(getCNext).mockReturnValue(undefined);
        const result = loadConsent();
        expect(result?.personalization).toBe(true);
    });
});

describe("saveConsent", () => {
    it("adds a timestamp to the state", () => {
        const state: ConsentState = { necessary: true, analytics: false, personalization: false, marketing: false };
        const result = saveConsent(state);
        expect(result.timestamp).toBeDefined();
        expect(() => new Date(result.timestamp!)).not.toThrow();
    });

    it("calls setCookie with COOKIE_CONSENT_NAME", () => {
        const state: ConsentState = { necessary: true, analytics: false, personalization: false, marketing: false };
        saveConsent(state);
        expect(setCNext).toHaveBeenCalled();
    });

    it("saves to localStorage", () => {
        const state: ConsentState = { necessary: true, analytics: true, personalization: false, marketing: false };
        saveConsent(state);
        const stored = localStorage.getItem(COOKIE_CONSENT_NAME);
        expect(stored).not.toBeNull();
    });
});

describe("hasAnyConsent", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.mocked(getCNext).mockReturnValue(undefined);
    });

    it("returns false when no consent stored", () => {
        expect(hasAnyConsent()).toBe(false);
    });

    it("returns true when consent is stored", () => {
        const state: ConsentState = { necessary: true, analytics: false, personalization: false, marketing: false };
        localStorage.setItem(COOKIE_CONSENT_NAME, encodeURIComponent(JSON.stringify(state)));
        expect(hasAnyConsent()).toBe(true);
    });
});

describe("updateConsent", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.mocked(getCNext).mockReturnValue(undefined);
    });

    it("merges partial update with existing consent", () => {
        const initial: ConsentState = { necessary: true, analytics: false, personalization: false, marketing: false };
        localStorage.setItem(COOKIE_CONSENT_NAME, encodeURIComponent(JSON.stringify(initial)));

        const result = updateConsent({ analytics: true });
        expect(result.analytics).toBe(true);
        expect(result.necessary).toBe(true);
    });

    it("creates new consent from defaultConsent when none exists", () => {
        const result = updateConsent({ marketing: true });
        expect(result.necessary).toBe(true);
        expect(result.marketing).toBe(true);
    });
});
