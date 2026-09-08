# @raincheck/glyph-react

Small, focused, tree-shakeable React hooks with TypeScript declarations.

```sh
npm install @raincheck/glyph-react react
```

```ts
import { useOnOff, useStateRef } from "@raincheck/glyph-react/state";
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

## Publishing

Run in Git Bash from this repository:

```sh
npm run release
```

The script verifies the package, prompts for an npm token without displaying it,
and publishes the current version publicly to npm. The token is passed through
the script's environment and cleared when the script exits; it is never written
to a file. The committed .npmrc contains only the NPM_TOKEN placeholder.

The token must have publishing access to the package scope. npm may require a
2FA challenge unless the token permits bypassing 2FA.

To verify and preview publishing without uploading or prompting for a token:

```sh
npm run release -- --dry-run
```

Use a new package version for each release.
