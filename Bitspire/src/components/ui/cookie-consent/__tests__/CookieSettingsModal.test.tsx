import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-intl", () => ({
    useLocale: vi.fn(() => "pl"),
}));

vi.mock("@/i18n/translations", () => ({
    getTranslations: vi.fn(() => ({
        cookieSettings: {
            heading: "Ustawienia",
            description: "Opcje prywatności",
            necessary: "Niezbędne",
            necessaryDesc: "Wymagane do działania",
            analytics: "Analityka",
            analyticsDesc: "Statystyki ruchu",
            personalization: "Personalizacja",
            personalizationDesc: "Dostosowanie",
            marketing: "Marketing",
            marketingDesc: "Reklamy",
            rejectAll: "Odrzuć wszystko",
            acceptAll: "Akceptuj wszystko",
            close: "Zamknij",
        }
    })),
}));

const mockSetCategories = vi.fn();
const mockRejectAll = vi.fn();
const mockGrantAll = vi.fn();

vi.mock("@/hooks/useCookies", () => ({
    useCookieConsent: vi.fn(() => ({
        consent: { necessary: true, analytics: false, personalization: false, marketing: false },
        setCategories: mockSetCategories,
        rejectAll: mockRejectAll,
        grantAll: mockGrantAll,
    })),
}));

// Mock useModal to immediately return visible=true
vi.mock("@/hooks/useModal", () => ({
    useModal: vi.fn((open, { onClose }) => ({
        visible: open,
        dialogRef: { current: null },
        overlayClass: "",
        contentClass: "",
        handleClose: onClose,
    })),
}));

import { CookieSettingsModal } from "@/components/ui/cookie-consent/CookieSettingsModal";

describe("CookieSettingsModal", () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render when open is false", () => {
        const { container } = render(<CookieSettingsModal open={false} onClose={onClose} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders when open is true", () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Ustawienia")).toBeInTheDocument();
    });

    it("renders all 4 cookie categories", () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        expect(screen.getByText("Niezbędne")).toBeInTheDocument();
        expect(screen.getByText("Analityka")).toBeInTheDocument();
        expect(screen.getByText("Personalizacja")).toBeInTheDocument();
        expect(screen.getByText("Marketing")).toBeInTheDocument();
    });

    it("necessary category switch is disabled", () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        // The button corresponding to "Niezbędne" (first one)
        const btns = screen.getAllByRole("button");
        const necessaryBtn = btns[0]; // first button in the list
        expect(necessaryBtn).toBeDisabled();
    });

    it("calls setCategories when toggling a category", async () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        // Button for "Analityka" (second in the list)
        const btns = screen.getAllByRole("button");
        const analyticsBtn = btns[1];

        await userEvent.click(analyticsBtn);
        expect(mockSetCategories).toHaveBeenCalledWith(["analytics"], true);
    });

    it("calls rejectAll and onClose when 'Odrzuć wszystko' is clicked", async () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        await userEvent.click(screen.getByRole("button", { name: "Odrzuć wszystko" }));
        expect(mockRejectAll).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("calls grantAll and onClose when 'Akceptuj wszystko' is clicked", async () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        await userEvent.click(screen.getByRole("button", { name: "Akceptuj wszystko" }));
        expect(mockGrantAll).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when 'Zamknij' is clicked", async () => {
        render(<CookieSettingsModal open={true} onClose={onClose} />);
        await userEvent.click(screen.getByRole("button", { name: "Zamknij" }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
