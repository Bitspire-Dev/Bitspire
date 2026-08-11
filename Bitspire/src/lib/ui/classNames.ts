type ClassValue = string | number | boolean | null | undefined | Record<string, boolean> | ClassValue[];

function flattenClassValue(value: ClassValue, classes: string[]): void {
  if (!value && value !== 0) return;

  if (typeof value === 'string' || typeof value === 'number') {
    classes.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenClassValue(item, classes));
    return;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, enabled]) => {
      if (enabled) classes.push(key);
    });
  }
}

export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];
  values.forEach((value) => flattenClassValue(value, classes));
  return classes.join(' ');
}
