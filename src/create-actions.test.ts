import { describe, expect, it, vi } from 'vitest';
import { type ActionOptions, createActions } from './create-actions.ts';
import { intent } from './intent.ts';
import { type } from 'arktype';
import { ValidationError } from './validation-error.ts';

function createRequest(data: FormData, intent?: string) {
  if (typeof intent !== 'undefined') {
    data.set('intent', intent);
  }

  return {
    async formData() {
      return data;
    }
  } as Request;
}

function createTestActions<E>(options: ActionOptions<E>) {
  const handle = vi.fn().mockReturnValue({ value: true });

  return {
    handle,
    intents: [
      intent('test', type({ key: 'string.numeric.parse' }), handle),
      intent('test 2', type({}), vi.fn())
    ],
    actions: createActions(options)
  };
}

describe('createActions', () => {
  it('executes the correct intent', async () => {
    const { handle, actions, intents } = createTestActions({ key: 'intent' });
    const data = new FormData();
    data.set('key', '500');

    await expect(actions(createRequest(data, 'test'), intents)).resolves.toEqual({
      action: 'test',
      success: true,
      data: { value: true }
    });
    await expect(actions(createRequest(new FormData(), 'test'), intents)).rejects.toThrow(ValidationError);
    await expect(actions(createRequest(new FormData(), 'test 2'), intents)).resolves.toEqual({
      action: 'test 2',
      success: true,
      data: undefined
    });
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it('throws when no intent is specified', async () => {
    const { actions, intents } = createTestActions({ key: 'intent' });

    await expect(actions(createRequest(new FormData()), intents)).rejects.toThrow(new Error('Invalid intent: `null`'));
  });

  it('calls the custom parseFormData function', async () => {
    const parseFormData = vi.fn().mockReturnValue({ key: '500' });
    const { actions, intents } = createTestActions({
      key: 'intent',
      parseFormData
    });

    await expect(actions(createRequest(new FormData(), 'test'), intents)).resolves.toEqual({
      action: 'test',
      success: true,
      data: { value: true }
    });
    expect(parseFormData).toHaveBeenCalledTimes(1);
  });

  it('calls the custom handleError function', async () => {
    const handleError = vi.fn().mockReturnValue({ message: 'error' });
    const { actions, intents } = createTestActions({
      key: 'intent',
      handleError
    });

    await expect(actions(createRequest(new FormData(), 'test'), intents)).resolves.toEqual({
      action: 'test',
      success: false,
      error: { message: 'error' }
    });
    expect(handleError).toHaveBeenCalledTimes(1);
  });
});
