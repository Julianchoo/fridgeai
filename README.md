# FridgeAI

An AI-powered recipe generation application that transforms your fridge contents into delicious, personalized recipes. Simply upload a photo of your fridge and let AI create recipes with the ingredients you already have.

## 🚀 Features

- **📷 Photo Upload**: Take or upload photos of your fridge contents
- **🤖 AI Recipe Generation**: Get personalized recipes based on available ingredients
- **🔐 User Authentication**: Secure login with Google OAuth
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **⚡ Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **🗃️ Database Storage**: PostgreSQL with Drizzle ORM for recipe and user data

## 🛠️ Quick Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Database (local or hosted)
- **OpenAI API Key**: For AI recipe generation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Julianchoo/fridgeai.git
   cd fridgeai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file and fill in your variables:
   ```bash
   cp env.example .env
   ```

   Required environment variables:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/fridgeai"

   # Authentication
   BETTER_AUTH_SECRET="your-random-32-character-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # AI Integration
   OPENAI_API_KEY="sk-your-openai-api-key"
   OPENAI_MODEL="gpt-4o-mini"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Your application will be available at [http://localhost:3000](http://localhost:3000)

## 📱 How It Works

1. **Upload Photo**: Take or upload a photo of your fridge contents
2. **AI Analysis**: Our AI identifies ingredients from your photo
3. **Recipe Generation**: Get personalized recipes based on available ingredients
4. **Cook & Enjoy**: Follow the generated recipes and reduce food waste

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **AI Integration**: OpenAI API with Vercel AI SDK
- **Image Processing**: Vercel Blob for photo storage

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   
   Add these to your Vercel dashboard:
   - `POSTGRES_URL` - Production database URL
   - `BETTER_AUTH_SECRET` - Secure random string (32+ characters)
   - `GOOGLE_CLIENT_ID` - Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
   - `OPENAI_API_KEY` - OpenAI API key
   - `OPENAI_MODEL` - AI model (e.g., gpt-4o-mini)
   - `NEXT_PUBLIC_APP_URL` - Your production domain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy cooking! 🍳**