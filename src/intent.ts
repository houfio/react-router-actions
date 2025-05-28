import type { StandardSchemaV1 } from './standard-schema.ts';
import { ValidationError } from './validation-error.ts';
import type { Action } from './types.ts';

export function intent<N extends string, T extends object, S extends StandardSchemaV1>(
  name: N,
  schema: S,
  handle: (data: StandardSchemaV1.InferOutput<S>) => Promise<T>
): Action<N, T, unknown> {
  return {
    name,
    handle: async (data) => {
      const validated = await schema['~standard'].validate(data);

      if (validated.issues) {
        throw new ValidationError(validated.issues);
      }

      return { success: true, data: await handle(validated.value) };
    }
  };
}
