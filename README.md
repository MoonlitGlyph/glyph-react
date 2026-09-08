# @moonlit/glyph-react

Small, focused, tree-shakeable React hooks with TypeScript declarations.

```sh
npm install @moonlit/glyph-react react
```

```ts
import { useOnOff, useStateRef } from "@moonlit/glyph-react/state";
```

React 18 or 19 is required as a peer dependency. Only explicit category subpath
imports are supported.

## Hooks

| Subpath  | Hooks                              |
| -------- | ---------------------------------- |
| array    | useRandomPool                      |
| document | useDocumentTitle                   |
| render   | useRenderCount, useRenderPrint     |
| state    | useOnOff, useStateRef, useDirtyRef |
| time     | useDebounce, useToggleInterval     |

- useRandomPool(values) draws without replacement, refilling from the latest values
  when exhausted. Empty pools return undefined.
- useDocumentTitle(pageTitle, siteName) accepts the application name explicitly.
- useRenderCount() counts render attempts, including development renders.
- useRenderPrint(id, enabled) logs only when explicitly enabled. Pass the
  application's development flag.

## Development

```sh
npm install
npm run verify
```
