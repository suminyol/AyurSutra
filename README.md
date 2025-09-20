# AyurSutra - Panchakarma Patient Management System

A modern, responsive frontend application for managing Panchakarma therapy sessions, patient records, and practitioner workflows. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

AyurSutra is a comprehensive Panchakarma Patient Management and Therapy Scheduling Software designed to address the growing need for digital solutions in Ayurvedic healthcare. The platform bridges traditional Ayurvedic wisdom with modern technology to provide efficient patient care and therapy management.

### Key Features

- **Automated Therapy Scheduling**: Intelligent scheduling system for all five Panchakarma therapies
- **Real-Time Progress Tracking**: Visual progress monitoring with charts and milestones
- **Smart Notifications**: Automated alerts for pre/post-procedure precautions
- **Patient Management**: Comprehensive patient profiles and medical history
- **Dual User Interface**: Separate dashboards for patients and practitioners
- **Modern UI/UX**: Responsive design with dark/light theme support
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Headless UI + Heroicons
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── forms/          # Form components
│   └── charts/         # Chart components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── patient/        # Patient-specific pages
│   └── doctor/         # Doctor-specific pages
├── store/              # Redux store and slices
├── services/           # API service functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ayursutra-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Features Overview

### Authentication System
- User registration and login
- Role-based access (Patient/Doctor)
- Protected routes and navigation
- Session management

### Patient Dashboard
- Upcoming therapy sessions
- Progress tracking with visualizations
- Therapy history
- Notification center
- Profile management

### Doctor Dashboard
- Patient management
- Therapy scheduling
- Session history
- Patient progress monitoring
- Notification system

### Therapy Management
- Support for all five Panchakarma therapies:
  - Vamana (Therapeutic Vomiting)
  - Virechana (Purgation Therapy)
  - Basti (Enema Therapy)
  - Nasya (Nasal Therapy)
  - Raktamokshana (Bloodletting)
- Automated scheduling
- Pre/post-procedure notifications
- Therapy-specific precautions

### Progress Tracking
- Real-time progress monitoring
- Visual charts and graphs
- Milestone tracking
- Patient feedback integration

### Notification System
- Email notifications
- Push notifications
- SMS alerts (configurable)
- Pre/post-procedure reminders

## 🎯 User Roles

### Patient
- View and book therapy sessions
- Track progress and recovery
- Receive notifications and reminders
- Manage personal profile
- Submit feedback after sessions

### Doctor/Practitioner
- Manage patient records
- Schedule therapy sessions
- Monitor patient progress
- View therapy history
- Manage notifications

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for trust and professionalism
- **Wellness**: Green tones for health and healing
- **Ayurveda**: Warm yellow/orange tones for traditional feel
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Primary Font**: Inter (modern, clean)
- **Secondary Font**: Playfair Display (elegant, traditional)

### Components
- Consistent spacing and sizing
- Accessible color contrast
- Responsive design patterns
- Dark/light theme support

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:
- Custom color palette
- Extended animations
- Dark mode support
- Custom font families

### Redux Store
Organized into feature-based slices:
- `authSlice` - Authentication state
- `themeSlice` - Theme preferences
- `notificationSlice` - Notification management
- `therapySlice` - Therapy session management
- `patientSlice` - Patient data management

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## 🧪 Testing

The project includes:
- TypeScript for type safety
- ESLint for code quality
- Component testing setup (ready for implementation)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Deploy to Netlify
1. Build the project
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Ayurvedic practitioners for domain expertise
- Open source community for excellent tools
- Design inspiration from modern healthcare applications

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**AyurSutra** - Bridging Traditional Ayurveda with Modern Technology 🌿
