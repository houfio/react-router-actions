import { describe, expect, it } from 'vitest';
import { parseFormData } from './parse-form-data.ts';

describe('parseFormData', () => {
  it('creates an empty object', () => {
    const data = new FormData();

    expect(parseFormData(data)).toEqual({});
  });

  it('sets the correct fields', () => {
    const data = new FormData();
    data.append('key', 'value');

    expect(parseFormData(data)).toEqual({ key: 'value' });
  });

  it('overwrites duplicate keys', () => {
    const data = new FormData();
    data.append('key', 'value');
    data.append('key', 'value 2');

    expect(parseFormData(data)).toEqual({ key: 'value 2' });
  });

  it('infers keys with brackets as arrays', () => {
    const data = new FormData();
    data.append('key[]', 'value');

    expect(parseFormData(data)).toEqual({ key: ['value'] });
  });

  it('appends values of duplicate array keys', () => {
    const data = new FormData();
    data.append('key[]', 'value');
    data.append('key[]', 'value 2');

    expect(parseFormData(data)).toEqual({ key: ['value', 'value 2'] });
  });

  it('skips non-string values', () => {
    const data = new FormData();
    data.append('blob', new Blob());

    expect(parseFormData(data)).toEqual({});
  });
});
