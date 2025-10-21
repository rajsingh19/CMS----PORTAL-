@echo off
echo 🚀 Setting up Shopping Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🔧 Setting up environment variables...
if not exist .env.local (
    copy env.example.txt .env.local
    echo ✅ Created .env.local file.
    echo ⚠️  IMPORTANT: Please update DATABASE_URL in .env.local with your NeonDB connection string!
    echo    Get it from: https://console.neon.tech/
) else (
    echo ⚠️  .env.local already exists. Skipping creation.
)

echo 🗄️  Setting up database...
npx prisma generate
npx prisma db push

echo 🌱 Seeding database with sample data...
npx prisma db seed

echo.
echo ✅ Setup completed successfully!
echo.
echo 🔑 Default login credentials:
echo    Admin: admin@example.com / admin123
echo    User:  user@example.com / user123
echo.
echo 🚀 Start the development server with:
echo    npm run dev
echo.
echo 🌐 Then open http://localhost:3000 in your browser
pause
