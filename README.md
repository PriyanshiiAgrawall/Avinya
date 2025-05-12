# 🏥 MediSetu - Telehealth Platform for India

**MediSetu** is a full-featured telemedicine platform built to connect patients with certified doctors across India. From real-time virtual consultations to intelligent appointment booking, digital prescriptions, and admin-led doctor verification, MediSetu streamlines the entire healthcare experience online.

---

## 🌐 Live Demo

- **🌐 Application**: [MediSetu on Vercel](https://medi-setu.vercel.app/)
- **🖥️ Project Presentation**: [PPT Link](https://drive.google.com/drive/u/3/folders/1wSKzjTc2U-w-hPHBsub9xZOj5yg9RQn1)
- **📊 Workflow Diagram**:  
  ![Workflow Diagram](https://res.cloudinary.com/dop7kjln7/image/upload/v1747006073/ffk3em1bq0qiha0khsee.png)
- **📽️ Project Demo**: _[Coming Soon]_

---

## ✨ Key Features

- 🧑‍⚕️ Real-Time Video Consultations (WebRTC + live transcription)
- 🗓️ Intelligent Appointment System (filter doctors by city, rating, fees, experience)
- 🧠 AI-Powered Digital Prescriptions (Groq-generated summaries)
- 💳 Secure Payment Processing (Paddle)
- 💬 In-App Chat + Transcription Panel
- 🛂 Doctor Verification by Admin (including certificate review)
- 🧍‍♂️ Separate Portals for Doctors, Patients, and Admin

---

- **Frontend Deployment (Vercel)**: [Deploy Frontend on Vercel](https://medi-setu.vercel.app/)
- **Backend Deployment (Render)**: [Deploy Backend on Render](https://medisetu.onrender.com)

## 🛠️ Tech Stack

### Frontend

| Tool              | Purpose                 |
| ----------------- | ----------------------- |
| **Next.js 14**    | Framework               |
| **Tailwind CSS**  | Styling                 |
| **React**         | UI Components           |
| **Redux Toolkit** | State Management        |
| **Socket.io**     | Real-time Communication |
| **Groq AI**       | Transcription & Summary |
| **WebRTC**        | Video Calling           |
| **Zod**           | Form Validation         |

### Backend

| Tool                            | Purpose             |
| ------------------------------- | ------------------- |
| **Node.js + Express.js**        | API server          |
| **MongoDB**                     | Database            |
| **JWT + Bcrypt**                | Authentication      |
| **Multer + Sharp + Cloudinary** | File uploads        |
| **Paddle**                      | Payment integration |
| **CORS**                        | API security        |
| **Axios**                       | HTTP Requests       |

---

## 📁 Project Structure

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
git https://github.com/PriyanshiiAgrawall/Avinya

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
