 Content Broadcasting System

A backend service for educational content broadcasting with teacher upload flow, principal approval, and scheduled live rotation.

 Submission Links

- GitHub Repository (Public): https://github.com/ARISH570/Content-Broadcasting-System
- API Documentation (Postman Guide): https://github.com/ARISH570/Content-Broadcasting-System/blob/main/POSTMAN_TESTING_GUIDE.md

 Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MySQL + Sequelize ORM
- Authentication: JWT + bcrypt
- Upload Handling: Multer

 Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/ARISH570/Content-Broadcasting-System.git
   cd Content-Broadcasting-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=content_broadcasting
   JWT_SECRET=your_jwt_secret_key
   ```

4. Create MySQL database:
   - `content_broadcasting`

5. Start the server:
   ```bash
   npm start
   ```
   API base URL: `http://localhost:5000`

 API Usage

 Authentication

- Register user:
  - `POST /api/auth/register`
- Login user:
  - `POST /api/auth/login`

 Teacher APIs

- Upload content:
  - `POST /api/content/upload`
- View own uploaded content:
  - `GET /api/content/my`

 Principal APIs

- View pending content:
  - `GET /api/content/pending`
- Approve content:
  - `PUT /api/content/:id/approve`
- Reject content:
  - `PUT /api/content/:id/reject`
- View all content:
  - `GET /api/content`

 Public API

- Get currently live content for a teacher:
  - `GET /api/live/:teacherId`

For complete request/response payloads and step-by-step testing, use:
- `POSTMAN_TESTING_GUIDE.md`
- `FEATURES_IMPLEMENTED.md`


