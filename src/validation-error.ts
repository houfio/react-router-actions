import type { StandardSchemaV1 } from './standard-schema.ts';

export class ValidationError extends Error {
  readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super('Validation error');

    this.issues = issues;
  }
}
