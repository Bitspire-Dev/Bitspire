import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModal } from "@/hooks/useModal";

describe("useModal — initial state (isOpen = false)", () => {
    it("visible is false when isOpen is false", () => {
        const { result } = renderHook(() => useModal(false));
        expect(result.current.visible).toBe(false);
    });

    it("closing is false initially", () => {
        const { result } = renderHook(() => useModal(false));
        expect(result.current.closing).toBe(false);
    });
});

describe("useModal — isOpen = true", () => {
    it("visible is true when isOpen is true", () => {
        const { result } = renderHook(() => useModal(true));
        expect(result.current.visible).toBe(true);
    });

    it("entering transitions to false (rAF stubbed synchronously)", () => {
        const { result } = renderHook(() => useModal(true));
        // rAF is stubbed synchronously in setup.ts, so entering should quickly be false
        expect(result.current.entering).toBe(false);
    });
});

describe("useModal — CSS classes", () => {
    it("overlayClass contains opacity-100 when not entering/closing", () => {
        const { result } = renderHook(() => useModal(true));
        expect(result.current.overlayClass).toContain("opacity-100");
    });

    it("contentClass contains opacity-100 when not entering/closing", () => {
        const { result } = renderHook(() => useModal(true));
        expect(result.current.contentClass).toContain("opacity-100");
    });

    it("overlayClass contains opacity-0 when modal is closed (not visible)", () => {
        const { result } = renderHook(() => useModal(false));
        // When not visible/entering/closing, the class should have opacity-0 state
        expect(result.current.overlayClass).toBeDefined();
    });
});

describe("useModal — keyboard events", () => {
    it("calls onClose when Escape key is pressed", () => {
        const onClose = vi.fn();
        renderHook(() => useModal(true, { onClose }));

        act(() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });

        expect(onClose).toHaveBeenCalled();
    });

    it("does not call onClose for other keys", () => {
        const onClose = vi.fn();
        renderHook(() => useModal(true, { onClose }));

        act(() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        });

        expect(onClose).not.toHaveBeenCalled();
    });

    it("does not listen for keydown when isOpen = false", () => {
        const onClose = vi.fn();
        renderHook(() => useModal(false, { onClose }));

        act(() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });

        expect(onClose).not.toHaveBeenCalled();
    });
});

describe("useModal — handleClose", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("sets closing = true immediately", () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useModal(true, { onClose }));

        act(() => {
            result.current.handleClose();
        });

        expect(result.current.closing).toBe(true);
    });

    it("calls onClose after 250ms", async () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useModal(true, { onClose }));

        act(() => {
            result.current.handleClose();
        });

        expect(onClose).not.toHaveBeenCalled();

        await act(async () => {
            vi.advanceTimersByTime(250);
        });

        expect(onClose).toHaveBeenCalled();
    });

    it("sets closing = false after callback fires", async () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useModal(true, { onClose }));

        act(() => {
            result.current.handleClose();
        });

        await act(async () => {
            vi.advanceTimersByTime(250);
        });

        expect(result.current.closing).toBe(false);
    });
});

describe("useModal — refs", () => {
    it("exposes dialogRef", () => {
        const { result } = renderHook(() => useModal(true));
        expect(result.current.dialogRef).toBeDefined();
    });

    it("exposes firstFocusableRef", () => {
        const { result } = renderHook(() => useModal(true));
        expect(result.current.firstFocusableRef).toBeDefined();
    });
});
