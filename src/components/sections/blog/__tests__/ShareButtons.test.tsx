import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareButtons from "@/components/sections/blog/ShareButtons";

describe("ShareButtons", () => {
    const props = {
        title: "Share this",
        buttons: {
            twitter: "Share on Twitter",
            linkedin: "Share on LinkedIn",
            facebook: "Share on Facebook",
            copyLink: "Copy URL",
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders all four buttons with correct labels", () => {
        render(<ShareButtons {...props} />);
        expect(screen.getByText("Share on Twitter")).toBeInTheDocument();
        expect(screen.getByText("Share on LinkedIn")).toBeInTheDocument();
        expect(screen.getByText("Share on Facebook")).toBeInTheDocument();
        expect(screen.getByText("Copy URL")).toBeInTheDocument();
    });

    it("renders the title", () => {
        render(<ShareButtons {...props} />);
        expect(screen.getByText("Share this")).toBeInTheDocument();
    });

    it("calls window.open when social buttons are clicked", async () => {
        const windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
        const user = userEvent.setup();

        render(<ShareButtons {...props} />);
        const twitterBtn = screen.getByRole("button", { name: /Twitter/i });

        await user.click(twitterBtn);
        expect(windowOpenSpy).toHaveBeenCalledWith(
            expect.stringContaining("twitter.com/intent/tweet"),
            "_blank",
            expect.stringContaining("width=600")
        );
    });

    it("calls navigator.clipboard.writeText when copy link is clicked", async () => {
        const user = userEvent.setup();
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

        render(<ShareButtons {...props} />);
        const copyBtn = screen.getByRole("button", { name: /Copy/i });

        await user.click(copyBtn);

        await waitFor(() => {
            expect(writeTextSpy).toHaveBeenCalled();
            expect(copyBtn).toHaveAttribute("aria-pressed", "true");
        });
    });

    it("changes icon state after successful copy", async () => {
        vi.useFakeTimers();
        const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

        render(<ShareButtons {...props} />);
        const copyBtn = screen.getByRole("button", { name: /Copy/i });

        expect(copyBtn).toHaveAttribute("aria-pressed", "false");

        await act(async () => {
            fireEvent.click(copyBtn);
            await Promise.resolve();
        });

        expect(writeTextSpy).toHaveBeenCalled();

        expect(copyBtn).toHaveAttribute("aria-pressed", "true");

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(copyBtn).toHaveAttribute("aria-pressed", "false");
    });
});
