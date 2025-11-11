# Deskriptr - AI Product Description Generator

A Next.js application that generates compelling, unique product descriptions using AI. Built with modern web technologies and designed for e-commerce businesses.

## Features

- 🤖 **AI-Powered Generation**: Uses Hugging Face's free inference API for unique, context-aware descriptions
- 🎯 **Customizable Tones**: Choose from 6 different writing styles (Professional, Casual, Luxury, Technical, Fun, Urgent)
- 👥 **Target Audience Focus**: Tailor descriptions for specific customer segments
- 📝 **Feature Integration**: Incorporate specific product features into descriptions
- 💾 **History Tracking**: Save and view all generated descriptions
- 🔐 **User Authentication**: Secure user accounts with Clerk
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 💰 **Completely Free**: Uses Hugging Face's free tier - no paid API required

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Hugging Face API key (free)
- Clerk authentication keys

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Services (FREE)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional: OpenAI (if you prefer paid service)
OPENAI_API_KEY=your_openai_api_key
```

### Getting Your Free Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token with "read" permissions
5. Copy the token to your `.env.local` file

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-product-desc-generator
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **User Input**: Enter product details including name, type, target audience, features, and preferred tone
2. **Multi-Model AI Processing**: The system tries multiple AI models with optimized prompts:
   - Microsoft's DialoGPT-large (primary)
   - GPT-2-large (fallback)
   - Facebook's BlenderBot (alternative)
   - Additional fallback models for reliability
3. **Smart Generation**: Each model uses specialized prompts designed for maximum variety:
   - Conversational prompts for DialoGPT
   - Structured prompts for GPT-2
   - Context-aware prompts for BlenderBot
4. **Quality Enhancement**: AI-generated text is enhanced with:
   - Grammar and spelling correction
   - Tone-appropriate vocabulary
   - Product-specific context integration
   - Professional formatting
5. **Intelligent Fallback**: If AI models fail, uses highly varied algorithmic generation with:
   - 8 different opening styles
   - 6 product descriptor variants
   - 5 audience connector types
   - 3 different paragraph structures
   - Randomized combinations for uniqueness
6. **Storage**: All generated descriptions are saved to your account for future reference

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **AI**: Hugging Face Inference API (FREE)
- **Authentication**: Clerk
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with custom responsive design

## API Endpoints

- `POST /api/generate` - Generate new product description
- `GET /api/descriptions` - Retrieve user's generated descriptions
- `POST /api/stripe-webhook` - Handle Stripe webhooks (if using payments)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
