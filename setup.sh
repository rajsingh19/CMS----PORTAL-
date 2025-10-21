#!/bin/bash

echo "🚀 Setting up Shopping Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp env.example.txt .env.local
    echo "✅ Created .env.local file."
    echo "⚠️  IMPORTANT: Please update DATABASE_URL in .env.local with your NeonDB connection string!"
    echo "   Get it from: https://console.neon.tech/"
else
    echo "⚠️  .env.local already exists. Skipping creation."
fi

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "🌱 Seeding database with sample data..."
npx prisma db seed

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🔑 Default login credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   User:  user@example.com / user123"
echo ""
echo "🚀 Start the development server with:"
echo "   npm run dev"
echo ""
echo "🌐 Then open http://localhost:3000 in your browser"
