#!/bin/sh
set -e

echo "🚀 Starting AI Website Rebuilder API..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "   PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "✅ PostgreSQL is up and ready!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
until nc -z redis 6379; do
  echo "   Redis is unavailable - sleeping"
  sleep 2
done
echo "✅ Redis is up and ready!"

# Run database migrations
echo "🔄 Running database migrations..."
cd /app/apps/api
npx prisma migrate deploy

# Check migration status
if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully!"
else
  echo "❌ Database migrations failed!"
  exit 1
fi

# Generate Prisma Client (in case schema changed)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Start the application
echo "🎯 Starting NestJS application..."
cd /app
exec "$@"
