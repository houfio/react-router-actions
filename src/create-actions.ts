import type { Action, Actions, ParsedFormData } from './types.ts';
import { parseFormData } from './parse-form-data.ts';

export type ActionOptions<E> = {
  key: string;
  handleError?: (error: unknown) => E;
  parseFormData?: (data: FormData) => ParsedFormData;
};

export function createActions<E>(options: ActionOptions<E>) {
  return async <const A extends Action<string, object, unknown>[]>(request: Request, actions: A) => {
    const data = await request.formData();
    const intent = data.get(options.key);
    const action = actions.find((a) => a.name === intent);

    if (!action) {
      throw new Error(`Invalid intent: \`${intent}\``);
    }

    const parsedData = (options.parseFormData ?? parseFormData)(data);
    let result: object;

    try {
      result = await action.handle(parsedData);
    } catch (e) {
      const error = options.handleError?.(e);

      if (error === undefined) {
        throw e;
      }

      result = { success: false, error };
    }

    return {
      action: intent,
      ...result
    } as Actions<A, NonNullable<E>>[number];
  };
}
