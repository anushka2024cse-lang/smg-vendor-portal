# API Reference

Complete API documentation for SMG Vendor Portal backend.

**Base URL:** `http://localhost:5000/api/v1`

---

## Authentication

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "vendor"
  }
}
```

---

## Notifications API

### Get All Notifications
```
GET /notifications
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `unreadOnly` (boolean) - Filter unread only (default: false)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "unreadCount": 5,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "notification_id",
      "recipient": "temp-user-id",
      "type": "success",
      "title": "SOR Approved",
      "message": "Your SOR has been approved",
      "link": "/sor/workspace/123",
      "isRead": false,
      "createdAt": "2024-12-22T10:30:00Z"
    }
  ]
}
```

### Create Notification
```
POST /notifications
```

**Request Body:**
```json
{
  "recipient": "temp-user-id",
  "type": "info",
  "title": "Notification Title",
  "message": "Notification message",
  "link": "/dashboard",
  "sendEmail": true,
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification created and email sent",
  "data": {
    "_id": "notification_id",
    "recipient": "temp-user-id",
    "type": "info",
    "title": "Notification Title",
    "message": "Notification message",
    "isRead": false,
    "createdAt": "2024-12-22T10:30:00Z"
  }
}
```

### Mark as Read
```
PUT /notifications/:id/read
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "notification_id",
    "isRead": true,
    "readAt": "2024-12-22T10:35:00Z"
  }
}
```

### Mark All as Read
```
PUT /notifications/read-all
```

**Response:**
```json
{
  "success": true,
  "message": "5 notifications marked as read",
  "count": 5
}
```

### Delete Notification
```
DELETE /notifications/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted",
  "data": {}
}
```

### Clear Read Notifications
```
DELETE /notifications/clear-read
```

**Response:**
```json
{
  "success": true,
  "message": "12 notifications cleared",
  "count": 12
}
```

---

## SOR API

### Get All SORs
```
GET /sor
```

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - Filter by status: Draft, Active, Approved, etc.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "data": [
    {
      "_id": "sor_id",
      "sorNumber": "SOR-202512-001",
      "documentNumber": "DOC-12345",
      "vendor": "vendor_id",
      "status": "Active",
      "companyDetails": {
        "companyName": "Example Corp",
        "contactPerson": "John Doe"
      },
      "createdAt": "2024-12-01T08:00:00Z"
    }
  ]
}
```

### Get Single SOR
```
GET /sor/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "sor_id",
    "sorNumber": "SOR-202512-001",
    "companyDetails": {...},
    "applicationDetails": {...},
    "specifications": [...]
  }
}
```

### Create SOR
```
POST /sor
```

**Request Body:**
```json
{
  "vendor": "vendor_id",
  "documentNumber": "DOC-12345",
  "companyDetails": {
    "companyName": "Example Corp",
    "companyAddress": "123 Street",
    "contactPerson": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "applicationDetails": {
    "applicationArea": "Automotive",
    "endApplication": "Vehicle Manufacturing"
  },
  "specifications": [
    {
      "parameter": "Temperature Range",
      "specification": "-40°C to 125°C",
      "unit": "°C"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "SOR created successfully",
  "data": {
    "_id": "sor_id",
    "sorNumber": "SOR-202512-002",
    "status": "Draft",
    "createdAt": "2024-12-22T10:40:00Z"
  }
}
```

### Update SOR
```
PUT /sor/:id
```

**Request Body:** (same as create, partial updates allowed)

### Delete SOR (Soft Delete)
```
DELETE /sor/:id
```

**Response:**
```json
{
  "success": true,
  "message": "SOR deleted successfully"
}
```

### Submit SOR for Review
```
POST /sor/:id/submit
```

**Response:**
```json
{
  "success": true,
  "message": "SOR submitted for review",
  "data": {
    "status": "Pending Review",
    "submittedDate": "2024-12-22T10:45:00Z"
  }
}
```

### Approve SOR
```
POST /sor/:id/approve
```

**Response:**
```json
{
  "success": true,
  "message": "SOR approved successfully",
  "data": {
    "status": "Approved"
  }
}
```

### Get SOR History
```
GET /sor/:id/history
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "version": 1,
      "changes": "Initial creation",
      "modifiedBy": "user_id",
      "modifiedAt": "2024-12-01T08:00:00Z"
    }
  ]
}
```

---

## Components API

### Get All Components
```
GET /components
```

### Get Component
```
GET /components/:id
```

### Create Component
```
POST /components
```

### Update Component
```
PUT /components/:id
```

### Delete Component
```
DELETE /components/:id
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting (Planned)

- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

---

## Authentication Headers

Include JWT token in requests:

```
Authorization: Bearer <token>
```

---

## Pagination

Paginated endpoints return:
```json
{
  "success": true,
  "data": [...],
  "page": 1,
  "pages": 10,
  "total": 95,
  "count": 10
}
```
