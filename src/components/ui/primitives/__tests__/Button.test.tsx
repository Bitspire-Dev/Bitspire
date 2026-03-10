import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/primitives/Button";

describe("Button", () => {
    it("renders children text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("calls onClick handler when clicked", async () => {
        const handler = vi.fn();
        render(<Button onClick={handler}>Click</Button>);
        await userEvent.click(screen.getByRole("button"));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is set", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not call onClick when disabled", async () => {
        const handler = vi.fn();
        render(<Button disabled onClick={handler}>Click</Button>);
        await userEvent.click(screen.getByRole("button"));
        expect(handler).not.toHaveBeenCalled();
    });

    it("applies default type='button' to avoid accidental form submission", () => {
        render(<Button>OK</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("applies primary variant classes by default", () => {
        render(<Button>Primary</Button>);
        const btn = screen.getByRole("button");
        expect(btn.className).toContain("bg-blue-600");
    });

    it("applies secondary variant classes", () => {
        render(<Button variant="secondary">Secondary</Button>);
        const btn = screen.getByRole("button");
        expect(btn.className).toContain("bg-brand-surface-2");
    });

    it("applies custom className", () => {
        render(<Button className="custom-class">Styled</Button>);
        expect(screen.getByRole("button").className).toContain("custom-class");
    });

    it("renders as link when asChild with anchor", () => {
        render(
            <Button asChild>
                <a href="/about">About</a>
            </Button>
        );
        expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    });
});
