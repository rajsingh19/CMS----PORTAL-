# Shopping Platform - Full-Stack Next.js Application

A modern, full-stack shopping platform built with Next.js 14, TypeScript, Prisma, and NextAuth.js. This application provides a complete e-commerce solution with admin dashboard, user authentication, and product management.

## 🚀 Features

### Core Features
- **Product Management**: Full CRUD operations for products
- **User Authentication**: Secure login/signup with NextAuth.js
- **Role-Based Access**: Admin and regular user roles
- **File Upload**: Multiple image support with UploadThing
- **Search & Filtering**: Advanced product search and category filtering
- **Pagination**: Efficient data loading with pagination
- **Responsive Design**: Mobile-first responsive UI

### Admin Features
- **Admin Dashboard**: Complete product management interface
- **Product CRUD**: Create, read, update, delete products
- **Draft System**: Save products as drafts before publishing
- **User Management**: View and manage user accounts
- **Analytics**: Product statistics and insights

### User Features
- **Product Browsing**: Browse all published products
- **Product Details**: Detailed product view with image gallery
- **Category Filtering**: Filter products by category (Men's, Women's, Kids)
- **Search**: Search products by title and description
- **External Links**: Direct links to purchase products

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: NeonDB PostgreSQL (serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary (with UploadThing as alternative)
- **Validation**: Zod
- **Forms**: React Hook Form

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up NeonDB database**
   - Create a free account at [NeonDB](https://neon.tech/)
   - Create a new project
   - Copy your connection string from the dashboard

4. **Set up Cloudinary (for image uploads)**
   - Create a free account at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret from the dashboard

5. **Set up environment variables**
   ```bash
   cp env.example.txt .env.local
   ```
   
   Update the `.env.local` file with your credentials:
   ```env
   # Database (NeonDB PostgreSQL)
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   ```

6. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Login Credentials

After running the seed script, you can use these credentials:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD endpoints
│   │   └── uploadthing/   # File upload endpoint
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── middleware.ts    # Auth middleware
│   └── utils.ts         # Utility functions
└── prisma/              # Database schema and migrations
    ├── schema.prisma    # Database schema
    └── seed.ts          # Database seed script
```

## 🌟 NeonDB Benefits

### Why NeonDB?
- **Serverless PostgreSQL**: Auto-scaling based on demand
- **Free Tier**: 500MB storage, 10GB bandwidth/month
- **Global Edge**: Fast access worldwide
- **Automatic Backups**: Point-in-time recovery
- **Database Branching**: Test changes safely
- **No Maintenance**: Fully managed service

### Production Ready
- **High Availability**: 99.9% uptime SLA
- **Security**: SSL encryption, IP whitelisting
- **Monitoring**: Built-in performance metrics
- **Scaling**: Automatic resource scaling

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your NeonDB connection string
     - `NEXTAUTH_URL`: Your production domain
     - `NEXTAUTH_SECRET`: A secure random string
   - Deploy!

### Other Platforms

For other deployment platforms, ensure you:
- Use your NeonDB connection string for `DATABASE_URL`
- Configure `NEXTAUTH_URL` for your domain
- Set up file upload service (UploadThing or AWS S3)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data

## 📊 Database Schema

### Users
- `id`: Unique identifier
- `name`: User's full name
- `email`: Email address (unique)
- `password`: Hashed password
- `role`: USER or ADMIN
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### Products
- `id`: Unique identifier
- `title`: Product name
- `description`: Product description
- `price`: Price in cents
- `buyLink`: External purchase link
- `category`: MENS, WOMENS, or KIDS
- `published`: Boolean for draft/published status
- `userId`: Creator's user ID
- `createdAt`: Creation date
- `updatedAt`: Last update date

### Product Images
- `id`: Unique identifier
- `url`: Image URL
- `alt`: Alt text for accessibility
- `productId`: Associated product ID

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in NextAuth.js protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **Role-Based Access**: Admin-only routes protection

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional design
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Image Optimization**: Next.js Image component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔄 Migration from Strapi

This application replaces a Strapi CMS backend with the following improvements:

- **Better Performance**: Next.js SSR/SSG capabilities
- **Type Safety**: Full TypeScript support
- **Modern Stack**: Latest React and Next.js features
- **Cost Effective**: Potentially lower hosting costs
- **Full Control**: Complete customization of API and UI
- **Better Developer Experience**: Integrated development workflow

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.