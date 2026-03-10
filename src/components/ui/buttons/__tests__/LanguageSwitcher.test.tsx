import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseRouter = { prefetch: vi.fn(), replace: vi.fn() };
const mockUsePathname = vi.fn();
const mockUseLocale = vi.fn();

vi.mock("@/i18n/routing", () => ({
    useRouter: () => mockUseRouter,
    usePathname: () => mockUsePathname(),
    resolvePathnameKey: vi.fn((path, locale) => (path === "/" ? "/" : `/${locale}`)),
}));

vi.mock("next-intl", () => ({
    useLocale: () => mockUseLocale(),
}));

import { LanguageSwitcher } from "@/components/ui/buttons/LanguageSwitcher";

describe("LanguageSwitcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders English flag when current locale is Polish", () => {
        mockUseLocale.mockReturnValue("pl");
        mockUsePathname.mockReturnValue("/pl/portfolio");
        render(<LanguageSwitcher />);
        expect(screen.getByAltText("English")).toBeInTheDocument();
    });

    it("renders Polish flag when current locale is English", () => {
        mockUseLocale.mockReturnValue("en");
        mockUsePathname.mockReturnValue("/en/portfolio");
        render(<LanguageSwitcher />);
        expect(screen.getByAltText("Polski")).toBeInTheDocument();
    });

    it("calls router.replace on click (frontend routing)", async () => {
        mockUseLocale.mockReturnValue("pl");
        mockUsePathname.mockReturnValue("/pl/blog");
        render(<LanguageSwitcher />);

        // Test the client side replacement using target transition
        const btn = screen.getByRole("button", { name: "Switch to English" });
        await userEvent.click(btn);
        // Because it's a transition, vitest with RTL might need async checks, but replace should have fired
        expect(mockUseRouter.replace).toHaveBeenCalled();
    });

    it("reloads page (assigns location) for admin paths", async () => {
        const assignMock = vi.fn();
        delete (window as Partial<Window>).location;
        window.location = { assign: assignMock } as unknown as Location;

        mockUseLocale.mockReturnValue("pl");
        mockUsePathname.mockReturnValue("/admin/pl/home");
        render(<LanguageSwitcher />);

        const btn = screen.getByRole("button");
        await userEvent.click(btn);
        expect(assignMock).toHaveBeenCalledWith("/admin/en/home");
    });
});
