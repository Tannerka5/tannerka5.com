#!/usr/bin/env bash
# Prints a SHA-256 of the public content the static site is generated from
# (projects + blog posts). Used by:
#   - deploy.yml        -> records the hash of the content it just deployed
#   - content-sync.yml  -> compares the live hash to the last deployed one and
#                          triggers a frontend rebuild when they differ
#
# Keys are sorted (jq -S) so the hash only changes when the data does.
set -euo pipefail

: "${PUBLIC_API_URL:?PUBLIC_API_URL is required}"
base="${PUBLIC_API_URL%/}"

out=""
for path in projects blog-posts; do
  # A failed request aborts the script (set -e), so an API outage can never be
  # mistaken for "content changed" or "content unchanged".
  out+="$(curl -fsS --retry 3 --retry-delay 3 --max-time 30 "$base/$path" | jq -S .)"$'\n'
done

printf '%s' "$out" | sha256sum | cut -d' ' -f1
