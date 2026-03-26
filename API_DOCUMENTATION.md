# Backend API Documentation

This document describes all API endpoints required for the Admin Dashboard to work with real data.

## Base URL
```
http://localhost:5000/api  (development)
https://your-domain.com/api  (production)
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication

#### POST /auth/login
Login user and get JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Admin",
    "email": "admin@example.com",
    "role": "Super Admin"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Invalid credentials

---

#### GET /auth/me
Get current logged-in user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "1",
  "name": "John Admin",
  "email": "admin@example.com",
  "role": "Super Admin"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

### 2. Users

#### GET /users
Get list of users with pagination.

**Query Parameters:**
- `limit` (number, optional): Items per page (default: 10)
- `page` (number, optional): Page number (default: 1)

**Response:**
```json
{
  "users": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "image": "https://example.com/avatar.jpg",
      "company": {
        "title": "Software Engineer"
      },
      "age": 30,
      "gender": "male",
      "status": "active"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

#### GET /users/search?q={query}
Search users by name or email.

**Query Parameters:**
- `q` (string, required): Search query

**Response:**
```json
{
  "users": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "image": "https://example.com/avatar.jpg",
      "company": {
        "title": "Software Engineer"
      }
    }
  ]
}
```

---

#### GET /users/:id
Get single user by ID.

**Response:**
```json
{
  "id": "1",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "image": "https://example.com/avatar.jpg",
  "company": {
    "title": "Software Engineer"
  },
  "age": 30,
  "gender": "male",
  "status": "active"
}
```

---

#### POST /users
Create new user.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "username": "janesmith",
  "password": "password123",
  "company": {
    "title": "Product Manager"
  }
}
```

**Response:**
```json
{
  "id": "2",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "username": "janesmith",
  "company": {
    "title": "Product Manager"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### PUT /users/:id
Update user by ID.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.new@example.com",
  "company": {
    "title": "Senior Product Manager"
  }
}
```

**Response:**
```json
{
  "id": "2",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.new@example.com",
  "username": "janesmith",
  "company": {
    "title": "Senior Product Manager"
  },
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

#### DELETE /users/:id
Delete user by ID.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

### 3. Orders

#### GET /orders
Get list of orders with pagination and filtering.

**Query Parameters:**
- `status` (string, optional): Filter by status (`all`, `pending`, `completed`, `cancelled`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Response:**
```json
{
  "orders": [
    {
      "id": "1",
      "orderNumber": "ORD-0001",
      "customer": "John Doe",
      "customerId": "1",
      "products": [
        {
          "id": "1",
          "name": "Product A",
          "quantity": 2,
          "price": 50.00
        }
      ],
      "total": 100.00,
      "discountedTotal": 90.00,
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

---

#### GET /orders/:id
Get single order by ID.

**Response:**
```json
{
  "id": "1",
  "orderNumber": "ORD-0001",
  "customer": "John Doe",
  "customerId": "1",
  "products": [
    {
      "id": "1",
      "name": "Product A",
      "quantity": 2,
      "price": 50.00
    }
  ],
  "total": 100.00,
  "discountedTotal": 90.00,
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### PATCH /orders/:id/status
Update order status.

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "id": "1",
  "orderNumber": "ORD-0001",
  "status": "completed",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Valid Status Values:**
- `pending`
- `completed`
- `cancelled`

---

### 4. Dashboard

#### GET /dashboard/stats
Get dashboard statistics and chart data.

**Response:**
```json
{
  "totalUsers": 150,
  "totalOrders": 320,
  "revenue": 45000.00,
  "activeUsers": 120,
  "chartData": [
    { "name": "Jan", "revenue": 4000, "orders": 240 },
    { "name": "Feb", "revenue": 3000, "orders": 198 },
    { "name": "Mar", "revenue": 5000, "orders": 300 },
    { "name": "Apr", "revenue": 4500, "orders": 280 },
    { "name": "May", "revenue": 6000, "orders": 390 },
    { "name": "Jun", "revenue": 5500, "orders": 350 }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Error code or details"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Sample Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Verify credentials...
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json(user);
});

// Protected Routes
app.get('/api/users', authMiddleware, async (req, res) => {
  // Fetch users from database
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  // Fetch orders from database
});

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  // Calculate stats from database
});
```

---

## Environment Variables for Frontend

Create `.env` file in frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com/api
```
