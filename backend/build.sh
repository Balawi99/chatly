#!/usr/bin/env bash

# Exit on error
set -e

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Print environment for debugging
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Print Prisma version
echo "Prisma version: $(npx prisma -v)"

# Apply database migrations (optional, uncomment if needed)
# npx prisma migrate deploy

echo "Build completed successfully!" 