# System Architecture

## Overview
SMG Vendor Portal is a full-stack MERN application for vendor management and procurement operations.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                           │
│                  localhost:3000                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React SPA)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components                                    │  │
│  │  - Pages: Dashboard, SOR, Payments, etc.            │  │
│  │  - Global: Header, Sidebar, NotificationCenter      │  │
│  │  - Contexts: ToastContext, AuthContext              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services Layer                                      │  │
│  │  - apiClient (Axios)                                 │  │
│  │  - sorService, notificationService, etc.            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API
                         │ /api/v1/*
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express)                          │
│                  localhost:5000                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes                                              │  │
│  │  /api/v1/sor                                         │  │
│  │  /api/v1/notifications                               │  │
│  │  /api/v1/components                                  │  │
│  │  /api/v1/auth                                        │  │
│  └───────────┬──────────────────────────────────────────┘  │
│              │                                              │
│              ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers                                         │  │
│  │  - Business Logic                                    │  │
│  │  - Request Validation                                │  │
│  │  - Response Formatting                               │  │
│  └───────────┬──────────────────────────────────────────┘  │
│              │                                              │
│              ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models (Mongoose)                                   │  │
│  │  - SOR, Notification, Component                      │  │
│  │  - User, Vendor, Payment                             │  │
│  └───────────┬──────────────────────────────────────────┘  │
│              │                                              │
│              ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Utilities                                           │  │
│  │  - emailService (Nodemailer)                         │  │
│  │  - fileUpload, validation, etc.                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  MONGODB DATABASE                           │
│  Collections:                                               │
│  - notifications                                            │
│  - sors                                                     │
│  - components                                               │
│  - users, vendors, payments                                 │
└─────────────────────────────────────────────────────────────┘

                         ↕
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│  - SMTP (Gmail/SendGrid) for emails                         │
│  - AWS S3 (future) for file storage                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components

**Pages:**
- `DashboardHome` - Main dashboard with stats
- `SORList` - List all SORs
- `CreateSor` - Create new SOR
- `SORWorkspace` - Edit/view SOR
- `AdminNotifications` - Manage notifications
- `PaymentList` - Payment tracking
- `ComponentDetails` - Component management

**Global Components:**
- `Header` - Top navigation with notifications
- `Sidebar` - Main navigation menu
- `NotificationCenter` - Bell icon dropdown
- `DashboardLayout` - Layout wrapper

**Contexts:**
- `ToastContext` - Toast notifications
- `AuthContext` - User authentication (planned)

### Backend Structure

**Routes:**
- `/api/v1/sor` - SOR CRUD operations
- `/api/v1/notifications` - Notification management
- `/api/v1/components` - Component management
- `/api/v1/auth` - Authentication
- `/api/v1/vendors` - Vendor management
- `/api/v1/payments` - Payment tracking

**Controllers:**
- Business logic layer
- Data validation
- Error handling
- Response formatting

**Models:**
- Data schema definitions
- Pre/post hooks
- Virtual fields
- Instance methods

## Data Flow

### Creating a Notification (Example Flow)

```
1. Admin opens /admin/notifications
   ↓
2. Fills form and clicks "Send"
   ↓
3. React calls notificationService.create(data)
   ↓
4. Axios POST to /api/v1/notifications
   ↓
5. Express routes to notificationController.createNotification
   ↓
6. Controller validates data
   ↓
7. Saves to MongoDB via Notification model
   ↓
8. If sendEmail=true, calls emailService.sendNotificationEmail
   ↓
9. Nodemailer sends email via SMTP
   ↓
10. Success response back to frontend
   ↓
11. Toast notification shown
   ↓
12. NotificationCenter auto-refreshes (30s interval)
   ↓
13. User sees new notification in bell icon
```

## Security Layers

1. **Frontend:**
   - Protected routes (ProtectedRoute wrapper)
   - Local storage for JWT tokens
   - Input validation

2. **Backend:**
   - JWT authentication middleware
   - CORS configuration
   - Helmet for HTTP headers
   - Rate limiting (planned)
   - Input sanitization

3. **Database:**
   - Mongoose schema validation
   - Indexes for performance
   - Soft deletes for data integrity

## Technology Choices

### Why MERN Stack?

**React:**
- Component reusability
- Virtual DOM performance
- Rich ecosystem

**Node.js + Express:**
- JavaScript full-stack
- Fast I/O operations
- Middleware architecture

**MongoDB:**
- Flexible schema
- JSON-like documents
- Horizontal scalability

### Additional Technologies

**Tailwind CSS:**
- Utility-first approach
- Fast development
- Small bundle size

**Nodemailer:**
- Email flexibility
- Template support
- Multiple transport options

**Vite:**
- Fast hot reload
- Optimized builds
- Modern tooling

## Deployment Architecture (Planned)

```
User → Cloudflare CDN → Frontend (Vercel/Netlify)
                              ↓ API Calls
                         Backend (AWS EC2/Heroku)
                              ↓
                         MongoDB Atlas
```

## Performance Considerations

1. **Frontend:**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service worker caching

2. **Backend:**
   - Database indexing
   - Query optimization
   - Redis caching (planned)
   - Connection pooling

3. **Database:**
   - Proper indexing
   - Aggregation pipelines
   - Pagination
   - Lean queries

## Scalability Strategy

**Horizontal Scaling:**
- Multiple backend instances
- Load balancer
- Session management with Redis

**Vertical Scaling:**
- Optimize queries
- Caching layer
- CDN for static assets

**Database Scaling:**
- MongoDB sharding
- Read replicas
- Index optimization

## Monitoring & Logging

**Current:**
- Console logging
- Error tracking in controllers

**Planned:**
- Winston for structured logging
- Sentry for error tracking
- Application metrics
- Database monitoring

## Future Enhancements

1. Real-time notifications (Socket.io)
2. File upload system (AWS S3)
3. Advanced analytics
4. Mobile app (React Native)
5. Microservices architecture
