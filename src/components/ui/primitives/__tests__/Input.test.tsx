import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/primitives/Input";

describe("Input", () => {
    it("renders the input element", () => {
        render(<Input placeholder="Enter username" />);
        expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    });

    it("handles user typing and onChange callback", async () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} placeholder="Type here" />);
        const input = screen.getByPlaceholderText("Type here");

        await userEvent.type(input, "abc");
        expect(handleChange).toHaveBeenCalledTimes(3);
        expect(input).toHaveValue("abc");
    });

    it("can be disabled", () => {
        render(<Input disabled placeholder="Disabled input" />);
        const input = screen.getByPlaceholderText("Disabled input");
        expect(input).toBeDisabled();
    });

    it("supports different types like email", () => {
        render(<Input type="email" placeholder="Email" />);
        const input = screen.getByPlaceholderText("Email");
        expect(input).toHaveAttribute("type", "email");
    });

    it("applies custom className over defaults", () => {
        render(<Input className="my-custom" placeholder="Custom" />);
        const input = screen.getByPlaceholderText("Custom");
        expect(input.className).toContain("my-custom");
    });

    it("forwards ref to the internal input element", () => {
        let focusRef: HTMLInputElement | null = null;
        render(<Input ref={(el) => { focusRef = el }} placeholder="Ref" />);
        expect(focusRef).not.toBeNull();
        if (focusRef) {
            (focusRef as HTMLInputElement).focus();
        }
        expect(screen.getByPlaceholderText("Ref")).toHaveFocus();
    });
});
