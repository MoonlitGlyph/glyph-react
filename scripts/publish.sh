#!/usr/bin/env bash
# Keep credentials out of shell tracing, including when invoked with bash -x.
set +x
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

case "${1-}" in
  "") ;;
  --dry-run) ;;
  *) printf 'Usage: npm run release [-- --dry-run]\n' >&2; exit 2 ;;
esac
if (( $# > 1 )); then
  printf 'Usage: npm run release [-- --dry-run]\n' >&2
  exit 2
fi

# Validate before asking for credentials.
npm run verify

if [[ "${1-}" == "--dry-run" ]]; then
  npm publish --access public --registry https://registry.npmjs.org/ --dry-run
  exit
fi

trap 'unset NPM_TOKEN' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
printf 'npm token (hidden): ' >&2
if ! IFS= read -r -s NPM_TOKEN; then
  printf '\nCould not read the npm token.\n' >&2
  exit 1
fi
printf '\n' >&2
if [[ -z "$NPM_TOKEN" || "$NPM_TOKEN" =~ [[:space:]] ]]; then
  printf 'The npm token must be nonempty and contain no whitespace.\n' >&2
  exit 1
fi

export NPM_TOKEN
npm publish --access public --registry https://registry.npmjs.org/
