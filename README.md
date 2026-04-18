

A modern web application built with Next.js for parsing and analyzing blood reports using advanced OCR technology and AI-powered insights. This application allows users to upload blood report images, extract data via OCR, analyze results with AI, and engage in conversational chat for personalized health insights with real time voice calling agent.

## Features

- **OCR Integration**: Advanced optical character recognition to extract data from blood report images and pdfs
- **AI-Powered Analysis**: Uses Google Generative AI for intelligent analysis of blood parameters
- **Real-time Multilingual Calling Agent**: Interactive multilingual calling interface powered by Vapi AI for health consultations
- **User Authentication**: Secure authentication system with session management
- **Doctor Prep Generator**: Consultation Cheat – Sheet – what to ask, what to mention and what to prioritize.
- **Nutrigenomic Menu Overlay**: Personalized dietary insights based on your specific metabolic markers
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Specialist Navigator**: If your report shows specific liver markers, the AI suggests the top- rated local hepatologists.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better auth system with session management
- **AI Services**: Google Generative AI
- **Voice Calls**: Vapi AI integration

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nikhil-2x/SummerHacks.git
   cd SummerHacks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blood_report_parser"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_AI_API_KEY="your-google-ai-api-key"
   VAPI_API_KEY="your-vapi-api-key"
   DAILY_API_KEY="your-daily-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Login**: Create an account or log in to access the application
2. **Upload Report**: Use the upload zone to upload blood report images
3. **OCR Processing**: The system automatically extracts text from the uploaded images
4. **AI Analysis**: View AI-powered analysis and insights about your blood parameters
5. **Chat Consultation**: Engage with the AI chat for personalized health advice
6. **Export Results**: Export your analysis results for record-keeping
7. **Call Consultation**: Engage with the AI Multilingual Agent for personalized health advice
8. **Nearest Specialist HealthCare Location**: On the basis of disease, provides the location of nearest specialist location

## API Endpoints

The application provides several API endpoints:

- `POST /api/auth/[...all]` - Authentication routes
- `POST /api/analyze` - Analyze uploaded blood reports
- `POST /api/analyze-menu` - Analyze menu items for dietary insights
- `POST /api/chat` - Chat functionality
- `GET /api/clinics` - Retrieve clinic information
- `GET /api/patient/insight` - Get patient insights
- `POST /api/verify-ocr` - Verify OCR results

## Database Schema

The application uses Prisma ORM with the following main models:
- **User**: User authentication and profile information
- **Session**: User session management
- **Account**: OAuth account linking

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Support

For support or questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- Built for SummerHacks 2026 by Team KavachX
- Powered by Next.js, Prisma, and modern AI technologies
