Content Broadcasting System

A backend service for educational content broadcasting with teacher upload flow, principal approval, and scheduled live rotation.

## Links

- GitHub Repository: https://github.com/ARISH570/Content-Broadcasting-System
- Postman Guide: https://github.com/ARISH570/Content-Broadcasting-System/blob/main/POSTMAN_TESTING_GUIDE.md
- Live API: https://content-broadcasting-system-xk9g.onrender.com

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Multer

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ARISH570/Content-Broadcasting-System.git
   cd Content-Broadcasting-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   JWT_SECRET=your_jwt_secret_key
   DB_MODE=local
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=content_broadcasting
   ```

4. Create a local MySQL database named `content_broadcasting`.

5. Start the server:
   ```bash
   npm start
   ```

Local API base URL: `http://localhost:5000`

## Database Modes

The app supports both local MySQL and Railway MySQL.

- `DB_MODE=local` uses `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME`
- `DB_MODE=railway` uses Railway connection variables

For apps deployed outside Railway, such as Render, use:

```env
DB_MODE=railway
JWT_SECRET=your_production_jwt_secret
MYSQL_PUBLIC_URL=your_railway_mysql_public_url
```

For apps deployed inside Railway, use:

```env
DB_MODE=railway
JWT_SECRET=your_production_jwt_secret
MYSQL_URL=your_railway_mysql_url
```

## Render Deployment

The current production deployment is running on Render and connected to Railway MySQL.

Use these Render settings:

- Build Command: `npm install`
- Start Command: `node server.js`

Add these environment variables in the Render dashboard:

```env
DB_MODE=railway
JWT_SECRET=your_production_jwt_secret
MYSQL_PUBLIC_URL=your_railway_mysql_public_url
```

Do not add local-only variables such as `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, or `DB_NAME` in Render.

## API Usage

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Teacher APIs

- `POST /api/content/upload`
- `GET /api/content/my`

### Principal APIs

- `GET /api/content/pending`
- `PUT /api/content/:id/approve`
- `PUT /api/content/:id/reject`
- `GET /api/content`

### Public API

- `GET /api/live/:teacherId`

For complete request and response examples, see:

- `POSTMAN_TESTING_GUIDE.md`
- `FEATURES_IMPLEMENTED.md`
