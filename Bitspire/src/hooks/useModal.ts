"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface UseModalOptions {
  onClose?: () => void;
  trapFocus?: boolean;
}

export function useModal(isOpen: boolean, options: UseModalOptions = {}) {
  const { onClose, trapFocus = true } = options;
  
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [entering, setEntering] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Sync with isOpen prop
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      setEntering(true);
      // Trigger enter animation on next frame
      const raf = requestAnimationFrame(() => setEntering(false));
      return () => cancelAnimationFrame(raf);
    }
    if (visible) {
      // Run exit animation then hide
      setClosing(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visible]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key
      if (e.key === "Escape" && onClose) {
        onClose();
      }

      // Tab trap
      if (trapFocus && e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusables.length === 0) return;
        
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, trapFocus]);

  // Auto-focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen && visible && dialogRef.current && !entering) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }
  }, [isOpen, visible, entering]);

  const handleClose = useCallback(() => {
    if (onClose) {
      setClosing(true);
      setTimeout(() => {
        onClose();
        setClosing(false);
      }, 250);
    }
  }, [onClose]);

  return {
    visible,
    closing,
    entering,
    dialogRef,
    firstFocusableRef,
    lastFocusableRef,
    handleClose,
    // CSS classes for animations
    overlayClass: `transition-opacity duration-300 ${entering || closing ? 'opacity-0' : 'opacity-100'}`,
    contentClass: `transform transition-all duration-300 ${entering || closing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`,
  };
}
