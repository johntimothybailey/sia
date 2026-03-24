#!/bin/sh
# Calculate the directory where the script is located
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Output the refactored component and the new domain hook with a clear delimiter
cat "$SCRIPT_DIR/../../skills/hook-ascender/references/basic/after-component.tsx"
echo "\n--- (after-hook.ts) ---\n"
cat "$SCRIPT_DIR/../../skills/hook-ascender/references/basic/after-hook.ts"
