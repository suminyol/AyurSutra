# 🔗 AyurSutra Frontend-Backend Integration Guide

This guide explains how the frontend and backend are integrated and how to run the complete application.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Frontend      │◄──────────────────►│   Backend       │
│   (React)       │                    │   (Express.js)  │
│   Port: 5173    │                    │   Port: 3000    │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│   Local Storage │                    │   MongoDB       │
│   (JWT Tokens)  │                    │   Database      │
└─────────────────┘                    └─────────────────┘
```

## 🔧 Integration Points

### 1. **Authentication Flow**
- Frontend stores JWT tokens in localStorage
- All API requests include `Authorization: Bearer <token>` header
- Backend validates tokens and provides role-based access

### 2. **API Communication**
- Frontend services make HTTP requests to backend endpoints
- Consistent error handling and response format
- Real-time data synchronization

### 3. **Data Flow**
```
User Action → Frontend Service → Backend API → Database
     ↑                                              ↓
     └─────────── Response ←─── Processing ←────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### 1. Start Backend
```bash
cd ayursutra-backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd ayursutra-frontend
npm install
npm run dev
```

### 3. Start Both (Recommended)
```bash
cd ayursutra-backend
node start-dev.js
```

## 📡 API Endpoints Integration

### Authentication Endpoints
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|---------|-------------|
| `authService.login()` | `/api/auth/login` | POST | User login |
| `authService.register()` | `/api/auth/register` | POST | User registration |
| `authService.logout()` | `/api/auth/logout` | POST | User logout |
| `authService.getProfile()` | `/api/users/profile` | GET | Get user profile |

### Appointment Endpoints
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|---------|-------------|
| `appointmentService.createAppointment()` | `/api/appointments` | POST | Create appointment |
| `appointmentService.getAppointments()` | `/api/appointments` | GET | Get appointments |
| `appointmentService.cancelAppointment()` | `/api/appointments/:id/cancel` | PUT | Cancel appointment |

### Treatment Endpoints
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|---------|-------------|
| `treatmentService.generateAITreatmentPlan()` | `/api/treatments/generate-ai-plan` | POST | Generate AI plan |
| `treatmentService.createTreatment()` | `/api/treatments` | POST | Create treatment |
| `treatmentService.getTreatmentProgress()` | `/api/treatments/:id/progress` | GET | Get progress |

### Payment Endpoints
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|---------|-------------|
| `paymentService.createPaymentOrder()` | `/api/payments/create-order` | POST | Create payment |
| `paymentService.verifyPayment()` | `/api/payments/verify` | POST | Verify payment |

## 🔐 Authentication Integration

### Frontend (React)
```typescript
// Store token after login
localStorage.setItem('ayursutra_auth_token', token);

// Include token in requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Backend (Express)
```javascript
// Middleware to verify token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

## 📊 Data Flow Examples

### 1. User Registration Flow
```
1. User fills registration form
2. Frontend calls authService.register()
3. Backend validates data and creates user
4. Backend returns JWT token
5. Frontend stores token and redirects to dashboard
```

### 2. Appointment Booking Flow
```
1. Patient selects doctor and time
2. Frontend calls appointmentService.createAppointment()
3. Backend checks doctor availability
4. Backend creates appointment record
5. Frontend updates UI with confirmation
```

### 3. AI Treatment Plan Flow
```
1. Doctor completes consultation
2. Frontend calls treatmentService.generateAITreatmentPlan()
3. Backend processes patient data with AI
4. Backend returns treatment plan
5. Doctor can customize plan
6. Frontend displays plan to patient
```

## 🛠️ Development Workflow

### 1. **Backend Development**
```bash
cd ayursutra-backend
npm run dev          # Start with nodemon
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
```

### 2. **Frontend Development**
```bash
cd ayursutra-frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### 3. **Full Stack Development**
```bash
cd ayursutra-backend
node start-dev.js   # Starts both frontend and backend
```

## 🔍 Testing Integration

### Backend Tests
```bash
cd ayursutra-backend
npm test                    # Run all tests
npm run test:integration    # Run integration tests
npm run test:coverage       # Run with coverage
```

### Frontend Tests
```bash
cd ayursutra-frontend
npm test                    # Run component tests
npm run test:e2e           # Run end-to-end tests
```

## 🐳 Docker Integration

### Run with Docker Compose
```bash
cd ayursutra-backend
docker-compose up -d
```

This starts:
- MongoDB database
- Backend API server
- Frontend build (if configured)
- Nginx reverse proxy

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ayursutra
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=AyurSutra
```

## 📱 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🚨 Common Issues & Solutions

### 1. **CORS Errors**
```javascript
// Backend: Ensure CORS is configured
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### 2. **Authentication Errors**
- Check if JWT token is properly stored in localStorage
- Verify token is included in request headers
- Ensure backend JWT_SECRET is set

### 3. **Database Connection**
- Ensure MongoDB is running
- Check MONGODB_URI in backend .env file
- Verify database permissions

### 4. **Port Conflicts**
- Backend: Change PORT in .env file
- Frontend: Change port in vite.config.js

## 🔄 Deployment Integration

### Production Build
```bash
# Backend
cd ayursutra-backend
npm run build
npm start

# Frontend
cd ayursutra-frontend
npm run build
# Serve dist/ folder with nginx or similar
```

### Environment Variables
Ensure all environment variables are set in production:
- Backend: Database, JWT secrets, API keys
- Frontend: API base URL, app configuration

## 📈 Monitoring & Logging

### Backend Logging
- Morgan for HTTP request logging
- Winston for application logging
- Error tracking with proper error handling

### Frontend Logging
- Console logging for development
- Error boundaries for React errors
- API error handling with user feedback

## 🎯 Next Steps

1. **Real-time Features**: Add WebSocket support for live updates
2. **Caching**: Implement Redis for session management
3. **File Upload**: Add image upload for profiles and documents
4. **Push Notifications**: Integrate FCM for mobile notifications
5. **Analytics**: Add user behavior tracking
6. **Performance**: Implement lazy loading and code splitting

## 📞 Support

For integration issues:
1. Check the console logs in both frontend and backend
2. Verify API endpoints with Swagger documentation
3. Test individual services with Postman/curl
4. Check network tab in browser dev tools

---

**🎉 Your AyurSutra application is now fully integrated and ready for development!**
