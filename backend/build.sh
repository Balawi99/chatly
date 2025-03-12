#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply database migrations (optional, uncomment if needed)
# npx prisma migrate deploy

echo "Build completed successfully!" 