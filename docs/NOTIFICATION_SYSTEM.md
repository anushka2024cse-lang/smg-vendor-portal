# Notification System Documentation

Complete guide to the notification system including in-app notifications, toast alerts, and email notifications.

---

## Overview

The notification system provides three layers of user communication:
1. **Toast Notifications** - Instant feedback for user actions
2. **Notification Center** - Persistent in-app notifications
3. **Email Notifications** - Professional emails for important events

---

## Architecture

```
User Action
    ↓
Toast (immediate feedback)
    ↓
Create Notification in DB
    ↓
[Optional] Send Email
    ↓
NotificationCenter updates (auto-refresh 30s)
```

---

## 1. Toast Notifications

### Usage

```javascript
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
    const toast = useToast();
    
    const handleSuccess = () => {
        toast.success('Operation completed!');
    };
    
    const handleError = () => {
        toast.error('Something went wrong');
    };
    
    const handleWarning = () => {
        toast.warning('Please review this action');
    };
    
    const handleInfo = () => {
        toast.info('New feature available');
    };
}
```

### Toast Types

| Type | Use Case | Icon | Color |
|------|----------|------|-------|
| `success` | Operation completed | ✓ | Green |
| `error` | Operation failed | ✗ | Red |
| `warning` | Caution needed | ⚠ | Amber |
| `info` | General information | ℹ | Blue |

### Configuration

- **Auto-dismiss:** 4 seconds (default)
- **Position:** Top-right
- **Max visible:** Unlimited
- **Animation:** Slide in from right

---

## 2. Notification Center

### Location
Bell icon in the top-right header

### Features
- Unread badge count
- Dropdown panel
- Mark as read
- Delete individual
- Clear all read
- Auto-refresh (30s)
- Relative timestamps

### Notification Types

```javascript
const types = [
    'info',      // General information
    'success',   // Positive events
    'warning',   // Cautions
    'error',     // Problems
    'sor',       // SOR-specific
    'payment',   // Payment-related
    'po',        // Purchase Order
    'vendor'     // Vendor-related
];
```

### API Integration

**Fetch Notifications:**
```javascript
import notificationService from '../services/notificationService';

// Get all
const response = await notificationService.getAll();

// Get unread only
const unread = await notificationService.getAll({ 
    unreadOnly: true 
});

// Get unread count
const count = await notificationService.getUnreadCount();
```

**Mark as Read:**
```javascript
await notificationService.markAsRead(notificationId);
await notificationService.markAllAsRead();
```

**Delete:**
```javascript
await notificationService.delete(notificationId);
await notificationService.clearRead();
```

---

## 3. Email Notifications

### Setup

See [EMAIL_SYSTEM.md](./EMAIL_SYSTEM.md) for complete setup guide.

### Email Templates

**1. Generic Notification** (`notification-email.html`)
- General-purpose template
- Used for most notifications
- Variables: `{{userName}}`, `{{title}}`, `{{message}}`, `{{actionUrl}}`

**2. SOR Approved** (`sor-approved.html`)
- SOR-specific styling
- Green success theme
- Variables: `{{sorNumber}}`, `{{companyName}}`

**3. Payment Processed** (`payment-processed.html`)
- Payment confirmation
- Blue financial theme
- Variables: `{{paymentId}}`, `{{amount}}`, `{{vendor}}`

### Sending Emails

**From Admin Panel:**
1. Navigate to `/admin/notifications`
2. Fill notification form
3. Check "📧 Also send Email Notification"
4. Enter recipient email
5. Click "Send Notification"

**Programmatically:**
```javascript
const { sendNotificationEmail } = require('../utils/emailService');

await sendNotificationEmail(notification, userEmail);
```

### Email Preview

All emails include:
- SMG branding header
- Notification content
- Call-to-action button (if link provided)
- Professional footer
- Unsubscribe link
- Responsive design

---

## Backend Implementation

### Model

**File:** `backend/models/Notification.js`

```javascript
{
    recipient: String,
    type: String (enum),
    title: String (required),
    message: String (required),
    link: String (optional),
    isRead: Boolean (default: false),
    readAt: Date,
    metadata: Mixed,
    createdAt: Date (auto)
}
```

### Controller

**File:** `backend/controllers/notificationController.js`

**Endpoints:**
- `GET /api/v1/notifications` - Get all
- `POST /api/v1/notifications` - Create
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all
- `DELETE /api/v1/notifications/:id` - Delete
- `DELETE /api/v1/notifications/clear-read` - Clear read

### Email Service

**File:** `backend/utils/emailService.js`

**Functions:**
- `sendEmail(options)` - Generic email sender
- `sendNotificationEmail(notification, email)` - For notifications
- `sendSORApprovalEmail(sor, email)` - For SOR approval
- `sendPaymentEmail(payment, email)` - For payments

---

## Frontend Components

### NotificationCenter

**File:** `src/global/components/NotificationCenter.jsx`

**Features:**
- Bell icon with badge
- Dropdown panel
- Notification list
- Action buttons
- Auto-refresh

**Usage:**
```javascript
import NotificationCenter from './NotificationCenter';

<Header>
    <NotificationCenter />
</Header>
```

### ToastProvider

**File:** `src/contexts/ToastContext.jsx`

**Setup:**
```javascript
// Wrap app
<ToastProvider>
    <App />
</ToastProvider>
```

---

## Best Practices

### When to Use Each Type

**Toast Notifications:**
- Form submission success/failure
- Quick feedback
- Temporary messages
- User-initiated actions

**Notification Center:**
- System events
- Workflow updates (SOR approved, payment processed)
- Cross-session notifications
- Important but not urgent

**Email Notifications:**
- Critical events
- When user not logged in
- Formal communications
- Audit trail needed

### Notification Writing Guide

**Good Titles:**
- ✓ "SOR-202512-001 Approved"
- ✓ "Payment Processed: ₹45,000"  
- ✗ "Update"
- ✗ "New Notification"

**Good Messages:**
- ✓ "Your Statement of Requirements has been approved by the manager"
- ✓ "Payment of ₹45,000 to NeoSky India processed successfully"
- ✗ "Something happened"
- ✗ "Check your dashboard"

**Links:**
- Always provide actionable links
- Use absolute paths: `/sor/workspace/123`
- Ensure links are valid

---

## Admin Panel Usage

### Creating Notifications

1. Go to `/admin/notifications`
2. Select notification type (affects color/icon)
3. Enter title (required)
4. Enter message (required)
5. Add link (optional)
6. Check email option if needed
7. Enter recipient email
8. Click "Send Notification"

### Quick Templates

Use pre-made templates:
- SOR Approved
- Payment Pending
- New PO Created
- System Maintenance

Click template to auto-fill form.

### Recent Notifications

- View last 10 sent
- Delete individual notifications
- See notification type and timestamp

---

## Troubleshooting

### Notifications not showing in bell icon
- Check recipient ID matches (currently 'temp-user-id')
- Verify backend is running
- Check browser console for errors
- Refresh notification center

### Emails not sending
- Verify EMAIL_PASS in `.env`
- Check Gmail App Password is correct
- Ensure 2FA enabled on Gmail account
- Check backend logs for SMTP errors

### Toast not appearing
- Verify ToastProvider wraps app
- Check useToast hook is imported correctly
- Look for console errors

---

## Future Enhancements

### Planned Features
1. Real-time notifications (Socket.io)
2. User notification preferences
3. Notification categories/filters
4. Push notifications (PWA)
5. SMS notifications (Twilio)
6. Notification scheduling
7. Rich media in notifications
8. Notification templates library

### Performance Optimizations
1. Notification batching
2. WebSocket connection
3. Service worker caching
4. Optimistic UI updates

---

## Testing

### Manual Testing Checklist

**Toast Notifications:**
- [ ] Success toast appears and auto-dismisses
- [ ] Error toast appears and auto-dismisses
- [ ] Multiple toasts stack correctly
- [ ] Close button works

**Notification Center:**
- [ ] Badge shows correct count
- [ ] Dropdown opens/closes
- [ ] Mark as read updates badge
- [ ] Delete removes notification
- [ ] Auto-refresh works

**Email Notifications:**
- [ ] Email received in inbox
- [ ] Template renders correctly
- [ ] Links work
- [ ] Mobile responsive
- [ ] Unsubscribe link present

---

## Examples

### Complete Flow Example

```javascript
// 1. User submits SOR
const handleSubmit = async () => {
    try {
        const sor = await sorService.create(formData);
        
        // 2. Show toast
        toast.success('SOR created successfully!');
        
        // 3. Create notification
        await notificationService.create({
            recipient: 'temp-user-id',
            type: 'sor',
            title: 'SOR Created',
            message: `SOR ${sor.sorNumber} has been created`,
            link: `/sor/workspace/${sor._id}`,
            sendEmail: true,
            userEmail: user.email
        });
        
        // 4. Redirect
        navigate('/sor/list');
    } catch (error) {
        toast.error('Failed to create SOR');
    }
};
```

---

For more details, see:
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Email System](./EMAIL_SYSTEM.md) - Email setup guide
- [Component Guide](./COMPONENT_GUIDE.md) - Component usage
