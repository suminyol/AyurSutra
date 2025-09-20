# AyurSutra Backend API

A robust REST API for AyurSutra - Panchakarma Patient Management and Therapy Scheduling Software.

## 🚀 Features

- **User Management**: Patient and Doctor registration, authentication, and profile management
- **Appointment System**: Booking, scheduling, and management of appointments
- **AI-Powered Treatment Plans**: Automated treatment plan generation with doctor override capabilities
- **Payment Integration**: Razorpay and Stripe payment gateway integration
- **Progress Tracking**: Real-time treatment progress monitoring
- **Notification System**: Email and SMS notifications for appointments and treatments
- **Role-Based Access Control**: Secure authentication and authorization
- **Comprehensive API Documentation**: Auto-generated Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay & Stripe
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest & Supertest
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd ayursutra-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── tests/           # Test files
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## 🔐 Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### Core Models
- **User**: Base user information
- **Patient**: Patient-specific data and medical history
- **Doctor**: Doctor profile and availability
- **Appointment**: Appointment scheduling and management
- **Treatment**: Treatment plans and progress tracking

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Treatments
- `POST /api/treatments/generate-ai-plan` - Generate AI treatment plan
- `POST /api/treatments` - Create treatment
- `GET /api/treatments` - Get treatments
- `PUT /api/treatments/:id/start` - Start treatment
- `PUT /api/treatments/:id/complete-stage` - Complete treatment stage

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker
```bash
# Build image
docker build -t ayursutra-backend .

# Run container
docker run -p 3000:3000 ayursutra-backend
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ayursutra |
| `JWT_SECRET` | JWT secret key | - |
| `EMAIL_HOST` | SMTP host | - |
| `RAZORPAY_KEY_ID` | Razorpay key ID | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Request validation and sanitization
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ayursutra.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics and reporting
- [ ] Mobile app API endpoints
- [ ] Integration with wearable devices
- [ ] Machine learning for treatment optimization
