@houfio/actions
---
A simple helper function to execute specific functions based on FormData, including validation with Standard Schema support. Designed to work well with the `react-router` data router.

### Example
```typescript jsx
### actions.ts
import { createActions } from '@houfio/actions';

const actions = createActions({ key: 'intent' });
###

### route.tsx
import { intent } from '@houfio/actions';

export function action({ request }: Route.ActionArgs) {
  return actions(request, [
    intent('createThing', z.object(), (data) => {
      console.log('success!');
    })
  ]);
}

export default functon Component() {
  return (
    <Form>
      <input type"hidden" name="intent" value="createThing"/>
      <button type="submit">Submit</button>
    </Form>
  )
}
###
```

### Usage
The `createActions` function is the entry point of the library. It takes a single object argument with several options:

| Name            | Type                                                | Description                                                                                                                                                           |
|-----------------|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`           | `string`                                            | The key of the input with the name of the action that should be executed.                                                                                             |
| `handleError`   | `((error: unknown) => unknown) \| undefined`        | A function that gets called when an exception is thrown within the intent. If it returns `undefined`, the original exception is thrown. This is the default behavior. |
| `parseFormData` | `((data: FormData) => ParsedFormData) \| undefined` | A function that parses the `FormData` object into a plain object. By default, it parses keys with brackets (`key[]`) as string arrays, and other keys as strings.     |

```typescript jsx
const actions = createActions({ ...options });
```

The `createActions` function returns another function. This function takes two arguments:

| Name      | Type       | Description                                               |
|-----------|------------|-----------------------------------------------------------|
| `request` | `Request`  | The request instance                                      |
| `intents` | `Intent[]` | The array of intents that are applicable for this request |

```typescript jsx
actions(request, [...intents]);
```

An intent can be created by calling the `intent` function exported by this module. The intent function takes three arguments:

| Name     | Type                       | Description                                                |
|----------|----------------------------|------------------------------------------------------------|
| `name`   | `string`                   | The request instance                                       |
| `schema` | `StandardSchemaV1`         | The array of intents that are applicable for this request  |
| `handle` | `(data: object) => object` | The function that gets called when the action is performed |
