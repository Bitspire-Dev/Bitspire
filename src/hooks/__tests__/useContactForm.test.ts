import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContactForm } from "@/hooks/useContactForm";

const fillForm = async (result: ReturnType<typeof renderHook<ReturnType<typeof useContactForm>, unknown>>["result"]) => {
    act(() => {
        result.current.handleChange({
            target: { name: "name", value: "Jan Kowalski" },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange({
            target: { name: "email", value: "jan@example.com" },
        } as React.ChangeEvent<HTMLInputElement>);
        result.current.handleChange({
            target: { name: "message", value: "Hello there!" },
        } as React.ChangeEvent<HTMLInputElement>);
    });
};

describe("useContactForm — initial state", () => {
    it("has empty form fields", () => {
        const { result } = renderHook(() => useContactForm());
        expect(result.current.formData.name).toBe("");
        expect(result.current.formData.email).toBe("");
        expect(result.current.formData.message).toBe("");
    });

    it("has loading = false", () => {
        const { result } = renderHook(() => useContactForm());
        expect(result.current.loading).toBe(false);
    });

    it("has success = false", () => {
        const { result } = renderHook(() => useContactForm());
        expect(result.current.success).toBe(false);
    });

    it("has empty error string", () => {
        const { result } = renderHook(() => useContactForm());
        expect(result.current.error).toBe("");
    });
});

describe("useContactForm — handleChange", () => {
    it("updates name field", () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({
                target: { name: "name", value: "Anna" },
            } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.formData.name).toBe("Anna");
    });

    it("updates email field", () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({
                target: { name: "email", value: "anna@example.com" },
            } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.formData.email).toBe("anna@example.com");
    });
});

describe("useContactForm — validation", () => {
    it("sets error when name is empty", async () => {
        const { result } = renderHook(() => useContactForm());
        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent);
        });
        expect(result.current.error).toContain("Imię");
    });

    it("sets error when email is empty", async () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({ target: { name: "name", value: "Jan" } } as React.ChangeEvent<HTMLInputElement>);
        });
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.error).toContain("Email");
    });

    it("sets error for invalid email format", async () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({ target: { name: "name", value: "Jan" } } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleChange({ target: { name: "email", value: "not-an-email" } } as React.ChangeEvent<HTMLInputElement>);
        });
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.error).toContain("email");
    });

    it("sets error when message is empty", async () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({ target: { name: "name", value: "Jan" } } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleChange({ target: { name: "email", value: "jan@example.com" } } as React.ChangeEvent<HTMLInputElement>);
        });
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.error).toContain("Wiadomość");
    });
});

describe("useContactForm — successful submit", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });
    });

    it("calls fetch with POST method", async () => {
        const { result } = renderHook(() => useContactForm());
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(global.fetch).toHaveBeenCalledWith(
            "/api/contact",
            expect.objectContaining({ method: "POST" })
        );
    });

    it("sets success = true after successful submit", async () => {
        const { result } = renderHook(() => useContactForm());
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.success).toBe(true);
    });

    it("resets form after success", async () => {
        const { result } = renderHook(() => useContactForm());
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.formData.name).toBe("");
    });

    it("calls onSuccess callback", async () => {
        const onSuccess = vi.fn();
        const { result } = renderHook(() => useContactForm({ onSuccess }));
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(onSuccess).toHaveBeenCalled();
    });
});

describe("useContactForm — failed submit", () => {
    it("sets error when response.ok is false", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false });
        const { result } = renderHook(() => useContactForm());
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.error).toBeTruthy();
    });

    it("calls onError callback when fetch fails", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
        const onError = vi.fn();
        const { result } = renderHook(() => useContactForm({ onError }));
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(onError).toHaveBeenCalledWith(expect.stringContaining("Network error"));
    });

    it("sets loading = false after failed request", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Fail"));
        const { result } = renderHook(() => useContactForm());
        await fillForm(result);
        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });
        expect(result.current.loading).toBe(false);
    });
});

describe("useContactForm — resetForm", () => {
    it("clears all form state", () => {
        const { result } = renderHook(() => useContactForm());
        act(() => {
            result.current.handleChange({ target: { name: "name", value: "Jan" } } as React.ChangeEvent<HTMLInputElement>);
            result.current.setError("some error");
        });
        act(() => result.current.resetForm());
        expect(result.current.formData.name).toBe("");
        expect(result.current.error).toBe("");
        expect(result.current.success).toBe(false);
    });
});
