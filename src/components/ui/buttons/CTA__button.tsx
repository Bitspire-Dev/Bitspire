"use client";
import React from "react";
import { Button } from '@/components/ui/primitives/Button';

export const CTAButton: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const scrollToContact = () => {
    const contactElement = document.getElementById('contact-section');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={scrollToContact}
      variant="ghost"
      size="lg"
      className={`
        btn-tech-primary
        px-8 py-4
        inline-flex items-center justify-center gap-3
        rounded-lg
        font-medium text-lg
        ${className}
      `}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.4.6 7.1 6.1a1 1 0 0 0 1.3 0l7.1-6.1M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{children}</span>
    </Button>
  );
};
