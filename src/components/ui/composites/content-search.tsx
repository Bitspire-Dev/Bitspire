'use client';

import { Input } from '@/components/ui/primitives/input';

interface ContentSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function ContentSearch({ value, onChange, placeholder }: ContentSearchProps) {
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
