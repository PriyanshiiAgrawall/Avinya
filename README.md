# MediSetu - Healthcare Platform

MediSetu is a comprehensive healthcare platform that connects patients with doctors through virtual consultations, appointment scheduling, and digital prescriptions.

## 🌟 Live Demo

- **Live Application**: [MediSetu](https://medisetuapp.onrender.com/)
- **Project Presentation**: [PPT Link]
- **Project Demo**: [Demo Video]

## 🚀 Features

- **Virtual Consultations**: Real-time video consultations between doctors and patients
- **Appointment Scheduling**: Easy booking system for both online and in-person appointments
- **Digital Prescriptions**: AI-powered consultation summaries and digital prescriptions
- **Secure Payments**: Integrated payment system using Paddle
- **Real-time Chat**: Live transcription during consultations
- **User Authentication**: Secure login and registration system
- **Profile Management**: Separate dashboards for doctors and patients

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React.js
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **State Management**: Redux Toolkit
- **Real-time Communication**: Socket.io
- **AI Integration**: Groq
- **Video Calls**: WebRTC

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT, bcrypt
- **API Security**: CORS
- **Database**: MongoDB
- **Payment Processing**: Paddle
- **File Storage**: Cloudinary
- **File Upload**: Multer, Sharp
- **HTTP Client**: Axios

## 🏗️ Project Structure

```
MediSetu/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Global styles
├── backend/
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── middleware/        # Custom middleware
└── public/                # Static files
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/medisetu.git
cd medisetu
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables
Create `.env.local` in the root directory:
```
NEXT_PUBLIC_API_BASE_URL=your_backend_url
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

4. Start the development server
```bash
# Start frontend
npm run dev

# Start backend (in a separate terminal)
cd backend
npm run dev
```

## 🔒 Environment Variables

### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_GROQ_API_KEY`: Groq API key for AI features

### Backend
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `PADDLE_API_KEY`: Paddle API key

## 📱 Features in Detail

### Virtual Consultations
- Real-time video calls using WebRTC
- Live chat and transcription
- Screen sharing capabilities
- Recording option (with consent)

### Appointment System
- Calendar-based scheduling
- Multiple consultation modes (online/in-person)
- Automated reminders
- Cancellation and rescheduling

### Digital Prescriptions
- AI-powered consultation summaries
- Digital prescription generation
- Downloadable PDF format
- Secure storage and sharing

### Payment Integration
- Secure payment processing
- Multiple payment methods
- Automated receipts
- Refund handling