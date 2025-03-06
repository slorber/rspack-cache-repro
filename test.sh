#! /bin/sh

# Cleanup caches
rm -rf node_modules/.cache


# 1st run - Codegen + Bundle
echo "export const dynamic = 42" > ./src/dynamicFile.js
node test

# 2nd run - Codegen (with === content) + Bundle => loader should not re-run
# Unfortunately, it re-runs for Rspack
echo "export const dynamic = 42" > ./src/dynamicFile.js
node test

# 3rd run - Codegen (with !== content) + Bundle => loader should re-run !
echo "export const dynamic = 82" > ./src/dynamicFile.js
node test


