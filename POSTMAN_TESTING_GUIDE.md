POSTMAN TESTING GUIDE
=====================

This guide supports both local and deployed testing for the Content Broadcasting System API.

Prerequisites
-------------
1. Start the API locally with `npm start`, or use the deployed Render URL.
2. Open Postman.
3. Create a collection named `Content Broadcasting System`.
4. Create a Postman environment named `CBS`.

Postman environment variables
-----------------------------
```text
base_url=http://localhost:5000
teacher_token=
principal_token=
```

To test the deployed API, change only:

```text
base_url=https://content-broadcasting-system-xk9g.onrender.com
```

Database reset guidance
-----------------------
- Local testing: recreate `content_broadcasting` or restart the server to re-sync tables.
- Deployed testing: do not reset production data. Use dedicated test users and test content.

Core request flow
-----------------

1. Register teacher
- `POST {{base_url}}/api/auth/register`
```json
{
  "name": "John Teacher",
  "email": "john@example.com",
  "password": "password123",
  "role": "teacher"
}
{
  "name": "Mary Teacher",
  "email": "mary@example.com",
  "password": "password123",
  "role": "teacher"
}
```

2. Register principal
- `POST {{base_url}}/api/auth/register`
```json
{
  "name": "Jane Principal",
  "email": "jane@example.com",
  "password": "password123",
  "role": "principal"
}

{
  "name": "isabella Principal",
  "email": "isabella@example.com",
  "password": "password123",
  "role": "principal"
}
```

3. Login teacher
- `POST {{base_url}}/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Save the response token in `teacher_token`.

4. Login principal
- `POST {{base_url}}/api/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
- Save the response token in `principal_token`.

5. Upload content as teacher
- `POST {{base_url}}/api/content/upload`
- Header: `Authorization: Bearer {{teacher_token}}`
- Body type: `form-data`

| Key | Type | Value |
|---|---|---|
| title | text | Maths Quiz 1 |
| subject | text | Maths |
| description | text | Chapter 1 quiz |
| start_time | text | 2026-04-26T10:00:00Z |
| end_time | text | 2026-04-26T12:00:00Z |
| rotation_duration | text | 5 |
| file | file | any `.jpg`, `.png`, or `.gif` |

6. View teacher content
- `GET {{base_url}}/api/content/my`
- Header: `Authorization: Bearer {{teacher_token}}`

7. View pending content as principal
- `GET {{base_url}}/api/content/pending`
- Header: `Authorization: Bearer {{principal_token}}`

8. Approve content as principal
- `PUT {{base_url}}/api/content/1/approve`
- Header: `Authorization: Bearer {{principal_token}}`

9. Reject content as principal
- `PUT {{base_url}}/api/content/2/reject`
- Header: `Authorization: Bearer {{principal_token}}`
```json
{
  "rejection_reason": "The content quality is not suitable for students"
}
```

10. Get live content
- `GET {{base_url}}/api/live/1`

Validation checklist
--------------------
- Invalid role returns `400 Bad Request`.
- Duplicate email returns `400 Bad Request`.
- Wrong password returns `401 Unauthorized`.
- Missing token returns `401 Unauthorized`.
- Invalid token returns `401 Unauthorized`.
- Teacher on principal-only routes returns `403 Forbidden`.
- Invalid file type returns `400 Bad Request`.
- File larger than 10MB returns `400 Bad Request`.
- Invalid teacher ID returns `400 Bad Request`.
- No approved active content returns:

```json
{
  "message": "No content available"
}
```

Suggested saved requests
------------------------
- `POST {{base_url}}/api/auth/register`
- `POST {{base_url}}/api/auth/login`
- `POST {{base_url}}/api/content/upload`
- `GET {{base_url}}/api/content/my`
- `GET {{base_url}}/api/content`
- `GET {{base_url}}/api/content/pending`
- `PUT {{base_url}}/api/content/:id/approve`
- `PUT {{base_url}}/api/content/:id/reject`
- `GET {{base_url}}/api/live/:teacherId`

Deployment notes
----------------
- Local development uses `DB_MODE=local`.
- Render deployment uses `DB_MODE=railway`.
- Render should use `MYSQL_PUBLIC_URL`.
- The current deployed API URL is `https://content-broadcasting-system-xk9g.onrender.com`.
