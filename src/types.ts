export type ParsedFormData = Record<string, string | string[]>;

export type Action<N extends string, T extends object, E> = {
  name: N;
  handle: (data: ParsedFormData) => Promise<ActionResult<T, E>>;
};
export type Actions<A extends Action<string, object, unknown>[], E> = {
  [K in keyof A]: A[K] extends Action<infer N, infer T, unknown> ? { action: N } & ActionResult<T, E> : never;
};

export type ActionResult<T extends object, E> = ActionSuccess<T> | ActionFailure<E>;
export type ActionSuccess<T extends object> = { success: true; data: T; error?: undefined };
export type ActionFailure<E> = { success: false; data?: undefined; error: E };
