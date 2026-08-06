'use client';

import { Input } from '@/components/ui/primitives/input';

interface PortfolioSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function PortfolioSearch({ value, onChange, placeholder }: PortfolioSearchProps) {
  return (
    <div className="mt-8 max-w-md">
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
