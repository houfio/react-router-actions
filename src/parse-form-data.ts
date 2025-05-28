import type { ParsedFormData } from './types.ts';

export function parseFormData(data: FormData) {
  const result: ParsedFormData = {};

  for (let [key, value] of data.entries()) {
    if (typeof value === 'object') {
      continue;
    }

    if (key.endsWith('[]')) {
      key = key.slice(0, -2);

      result[key] ??= [];
      (result[key] as string[]).push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
