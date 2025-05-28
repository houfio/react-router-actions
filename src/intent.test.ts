import { describe, expect, it, vi } from 'vitest';
import { intent } from './intent.ts';
import { type } from 'arktype';
import { ValidationError } from './validation-error.ts';

describe('intent', () => {
  const schema = type({ key: 'string.numeric.parse' });

  it('creates an intent object', () => {
    const mock = vi.fn();

    expect(intent('intent', schema, mock)).toEqual({
      name: 'intent',
      handle: expect.any(Function)
    });
  });

  it('calls the handle function with the validated data', async () => {
    const mock = vi.fn().mockReturnValue({ data: 'value' });
    const { handle } = intent('intent', schema, mock);

    await expect(handle({ key: '500' })).resolves.toEqual({
      success: true,
      data: { data: 'value' }
    });
    expect(mock).toHaveBeenCalledWith({ key: 500 });
  });

  it('throws an error if a validation error occurs', async () => {
    const mock = vi.fn();
    const { handle } = intent('intent', schema, mock);

    await expect(handle({ key: 'invalid' })).rejects.toBeInstanceOf(ValidationError);
    expect(mock).not.toHaveBeenCalled();
  });
});
