import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
    useLocale: vi.fn(() => "pl"),
}));

// Mock translations
vi.mock("@/i18n/translations", () => ({
    getTranslations: vi.fn(() => ({
        cookieBanner: {
            ariaLabel: "Cookie Dialog",
            heading: "Szanujemy Twoją prywatność",
            description: "Desc",
            privacyPolicy: "Polityka Prywatności",
            cookiePolicy: "Polityka Cookies",
            reject: "Odrzuć",
            settings: "Ustawienia",
            acceptAll: "Akceptuj wszystkie",
        },
        cookieSettings: {
            heading: "Ustawienia",
            rejectAll: "Odrzuć wszystkie",
            acceptAll: "Akceptuj wszystkie",
            close: "Zamknij",
        }
    })),
}));

// Mock hooks
const grantAllMock = vi.fn();
const rejectAllMock = vi.fn();

vi.mock("@/hooks/useCookies", () => ({
    useCookieConsent: vi.fn(() => ({
        consent: null,
        ready: true,
        grantAll: grantAllMock,
        rejectAll: rejectAllMock,
    })),
}));

vi.mock("@/hooks/useAdminLink", () => ({
    useAdminLink: vi.fn(() => ({
        getLink: vi.fn((path) => path),
    })),
}));

import { CookieBanner } from "@/components/ui/cookie-consent/CookieBanner";
import * as useCookiesModule from "@/hooks/useCookies";

describe("CookieBanner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it("renders when ready=true and consent=null", () => {
        vi.mocked(useCookiesModule.useCookieConsent).mockReturnValue({
            consent: null,
            ready: true,
            grantAll: grantAllMock,
            rejectAll: rejectAllMock,
            setCategories: vi.fn(),
            hasConsent: vi.fn(),
            COOKIE_CONSENT_NAME: "test"
        });

        render(<CookieBanner />);
        expect(screen.getByRole("dialog", { name: "Cookie Dialog" })).toBeInTheDocument();
        expect(screen.getByText("Szanujemy Twoją prywatność")).toBeInTheDocument();
    });

    it("does not render when consent is already granted", () => {
        vi.mocked(useCookiesModule.useCookieConsent).mockReturnValue({
            consent: { necessary: true, analytics: true, personalization: false, marketing: false, timestamp: "" },
            ready: true,
            grantAll: grantAllMock,
            rejectAll: rejectAllMock,
            setCategories: vi.fn(),
            hasConsent: vi.fn(),
            COOKIE_CONSENT_NAME: "test"
        });

        render(<CookieBanner />);
        expect(screen.queryByRole("dialog", { name: "Cookie Dialog" })).not.toBeInTheDocument();
    });

    it("does not render when ready=false", () => {
        vi.mocked(useCookiesModule.useCookieConsent).mockReturnValue({
            consent: null,
            ready: false,
            grantAll: grantAllMock,
            rejectAll: rejectAllMock,
            setCategories: vi.fn(),
            hasConsent: vi.fn(),
            COOKIE_CONSENT_NAME: "test"
        });

        render(<CookieBanner />);
        expect(screen.queryByRole("dialog", { name: "Cookie Dialog" })).not.toBeInTheDocument();
    });

    it("calls grantAll when 'Akceptuj wszystkie' is clicked", async () => {
        vi.mocked(useCookiesModule.useCookieConsent).mockReturnValue({
            consent: null, ready: true, grantAll: grantAllMock, rejectAll: rejectAllMock, setCategories: vi.fn(), hasConsent: vi.fn(), COOKIE_CONSENT_NAME: "test"
        });

        render(<CookieBanner />);
        const btn = screen.getByRole("button", { name: "Akceptuj wszystkie" });
        fireEvent.click(btn);

        await act(async () => {
            vi.advanceTimersByTime(300); // let timeout finish
        });

        expect(grantAllMock).toHaveBeenCalled();
    });

    it("calls rejectAll when 'Odrzuć' is clicked", async () => {
        vi.mocked(useCookiesModule.useCookieConsent).mockReturnValue({
            consent: null, ready: true, grantAll: grantAllMock, rejectAll: rejectAllMock, setCategories: vi.fn(), hasConsent: vi.fn(), COOKIE_CONSENT_NAME: "test"
        });

        render(<CookieBanner />);
        const btn = screen.getByRole("button", { name: "Odrzuć" });
        fireEvent.click(btn);

        await act(async () => {
            vi.advanceTimersByTime(300); // let timeout finish
        });

        expect(rejectAllMock).toHaveBeenCalled();
    });
});
