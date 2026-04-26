# Content Broadcasting System

A backend system for educational content broadcasting with authentication, approval workflow, and scheduled rotation.

## Features

- **Authentication & RBAC**: JWT-based auth with Principal and Teacher roles
- **Content Upload**: File upload with validation (JPG, PNG, GIF, max 10MB)
- **Approval Workflow**: Principal approval/rejection of content
- **Scheduled Broadcasting**: Subject-based rotation with time windows
- **Public API**: Live content endpoint for students

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT
- **File Upload**: Multer
- **Password Hashing**: bcrypt

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd content-broadcasting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Update `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=content_broadcasting
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Database Setup**
   - Create MySQL database: `content_broadcasting`
   - The app will auto-sync tables on startup

5. **Run the application**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "teacher" // or "principal"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Content Management (Protected)

#### Upload Content (Teacher)
```http
POST /api/content/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

- file: <image file>
- title: "Maths Quiz 1"
- subject: "Maths"
- description: "Optional description"
- start_time: "2024-01-01T10:00:00Z"
- end_time: "2024-01-01T12:00:00Z"
- rotation_duration: 5
```

#### Get Pending Content (Principal)
```http
GET /api/content/pending
Authorization: Bearer <token>
```

#### Approve Content (Principal)
```http
PUT /api/content/:id/approve
Authorization: Bearer <token>
```

#### Reject Content (Principal)
```http
PUT /api/content/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "rejection_reason": "Content not appropriate"
}
```

#### Get Teacher's Content (Teacher)
```http
GET /api/content/my
Authorization: Bearer <token>
```

#### Get All Content (Principal)
```http
GET /api/content
Authorization: Bearer <token>
```

### Public API

#### Get Live Content
```http
GET /api/live/:teacherId
```

Response:
```json
{
  "id": 1,
  "title": "Maths Quiz 1",
  "description": "Description",
  "subject": "Maths",
  "file_url": "/uploads/filename.jpg",
  "file_type": "image/jpeg"
}
```

Or if no content:
```json
{
  "message": "No content available"
}
```

## Database Schema

### Users
- id, name, email, password_hash, role, created_at

### Contents
- id, title, description, subject, file_url, file_type, file_size, uploaded_by, status, rejection_reason, approved_by, approved_at, start_time, end_time, rotation_duration, created_at

### ContentSlots
- id, subject, created_at

### ContentSchedules
- id, content_id, slot_id, rotation_order, duration, created_at

## Scheduling Logic

- Content is active only within start_time and end_time
- Within active period, content rotates based on subject
- Each subject has its own cycle: Content A (5min) -> B (5min) -> C (5min) -> repeat
- Public API returns currently active content for the teacher

## Assumptions

- Local file storage (can be upgraded to S3)
- No Redis caching implemented (bonus feature)
- Basic error handling
- MySQL database

## Demo

[Demo Video Link](https://example.com/demo)

## Deployment

[Deployment Link](https://example.com/api)