 POSTMAN TESTING GUIDE - Step by Step

 Prerequisites
1. Make sure the server is running: `npm start` (runs on http://localhost:5000)
2. Open Postman
3. Create a new collection called "Content Broadcasting System"

---

 ⚠️ IMPORTANT: Clear Database Before Testing
Delete the `content_broadcasting` database and recreate it fresh, OR restart the server. The app will auto-sync tables on startup.

---

 SECTION 1: AUTHENTICATION TESTING

 TEST 1: User Registration (Teacher)

What to test: Can a teacher register with valid credentials?

How to test:
1. Create a new request in Postman
2. Set method to POST
3. Set URL to `http://localhost:5000/api/auth/register`
4. Go to Body tab → Select raw → JSON
5. Paste this:
```json
{
  "name": "John Teacher",
  "email": "john@example.com",
  "password": "password123",
  "role": "teacher"
}
```
6. Click Send

Expected Response:
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```
Status: 201 Created ✅

---

 TEST 2: User Registration (Principal)

What to test: Can a principal register with valid credentials?

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/register`
3. Body (raw JSON):
```json
{
  "name": "Jane Principal",
  "email": "jane@example.com",
  "password": "password123",
  "role": "principal"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "User registered successfully",
  "userId": 2
}
```
Status: 201 Created ✅

---

 TEST 3: Registration with Invalid Role

What to test: Should reject invalid roles (only "teacher" or "principal" allowed)

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/register`
3. Body (raw JSON):
```json
{
  "name": "Invalid User",
  "email": "invalid@example.com",
  "password": "password123",
  "role": "admin"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "Invalid role"
}
```
Status: 400 Bad Request ✅

---

 TEST 4: Registration with Duplicate Email

What to test: Should reject duplicate email registration

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/register`
3. Body (raw JSON) - same email as TEST 1:
```json
{
  "name": "Another John",
  "email": "john@example.com",
  "password": "differentpassword",
  "role": "teacher"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "User already exists"
}
```
Status: 400 Bad Request ✅

---

 TEST 5: Login with Correct Credentials

What to test: Can a user login and get JWT token?

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/login`
3. Body (raw JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Teacher",
    "role": "teacher"
  }
}
```
Status: 200 OK ✅

🔴 IMPORTANT: Save this token! You'll need it for all protected routes.
- In Postman, create an environment variable
- Click Environment in top-right
- Create new environment "CBS"
- Add variable: `teacher_token` = (paste the token from response)

---

 TEST 6: Login with Incorrect Password

What to test: Should reject wrong password

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/login`
3. Body (raw JSON):
```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "Invalid credentials"
}
```
Status: 401 Unauthorized ✅

---

 TEST 7: Login with Non-existent Email

What to test: Should reject non-existent user

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/login`
3. Body (raw JSON):
```json
{
  "email": "nonexistent@example.com",
  "password": "anypassword"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "Invalid credentials"
}
```
Status: 401 Unauthorized ✅

---

 SECTION 2: TEACHER OPERATIONS - CONTENT UPLOAD

 TEST 8: Upload Content (Valid File)

What to test: Can a teacher upload image content with all required fields?

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/content/upload`
3. Go to Headers tab
4. Add header:
   - Key: `Authorization`
   - Value: `Bearer {{teacher_token}}` (or paste your token directly)
5. Go to Body tab → Select form-data
6. Add fields:

| Key | Type | Value |
|---|---|---|
| title | text | Maths Quiz 1 |
| subject | text | Maths |
| description | text | Chapter 1 quiz |
| start_time | text | 2026-04-26T10:00:00Z |
| end_time | text | 2026-04-26T12:00:00Z |
| rotation_duration | text | 5 |
| file | file | (select any .jpg, .png, or .gif image) |

7. Click Send

Expected Response:
```json
{
  "message": "Content uploaded successfully",
  "contentId": 1
}
```
Status: 201 Created ✅

---

 TEST 9: Upload Content without Required Fields

What to test: Should reject missing required fields (title, subject, file)

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/content/upload`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Body (form-data) - missing title:

| Key | Type | Value |
|---|---|---|
| subject | text | Science |
| file | file | (select image) |

5. Click Send

Expected Response:
```json
{
  "message": "Title, subject, and file are required"
}
```
Status: 400 Bad Request ✅

---

 TEST 10: Upload Invalid File Type

What to test: Should reject non-image files (only JPG, PNG, GIF allowed)

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/content/upload`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Body (form-data):

| Key | Type | Value |
|---|---|---|
| title | text | Science Notes |
| subject | text | Science |
| file | file | (select a .pdf or .txt file) |

5. Click Send

Expected Response:
```json
{
  "message": "Invalid file type. Only JPG, PNG, GIF allowed"
}
```
Status: 400 Bad Request ✅

---

 TEST 11: Upload File Exceeding Size Limit

What to test: Should reject files larger than 10MB

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/content/upload`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Body (form-data):

| Key | Type | Value |
|---|---|---|
| title | text | Large File Test |
| subject | text | Maths |
| file | file | (select an image larger than 10MB) |

5. Click Send

Expected Response:
```json
{
  "message": "File size exceeds 10MB"
}
```
Status: 400 Bad Request ✅

---

 TEST 12: Upload without Authentication Token

What to test: Should reject access without valid JWT token

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/content/upload`
3. Do NOT add Authorization header
4. Body (form-data):

| Key | Type | Value |
|---|---|---|
| title | text | Test Content |
| subject | text | Maths |
| file | file | (select image) |

5. Click Send

Expected Response:
```json
{
  "message": "No token"
}
```
Status: 401 Unauthorized ✅

---

 TEST 13: View Own Content (Teacher)

What to test: Can teacher see their uploaded content?

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/my`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Click Send

Expected Response:
```json
[
  {
    "id": 1,
    "title": "Maths Quiz 1",
    "description": "Chapter 1 quiz",
    "subject": "Maths",
    "file_url": "/uploads/1724000000000-image.jpg",
    "file_type": "image/jpeg",
    "file_size": 245678,
    "uploaded_by": 1,
    "status": "pending",
    "rejection_reason": null,
    "approved_by": null,
    "approved_at": null,
    "start_time": "2026-04-26T10:00:00.000Z",
    "end_time": "2026-04-26T12:00:00.000Z",
    "rotation_duration": 5,
    "created_at": "2026-04-26T10:33:00.000Z",
    "updatedAt": "2026-04-26T10:33:00.000Z"
  }
]
```
Status: 200 OK ✅

Note: Status should be "pending" (waiting for principal approval)

---

 SECTION 3: PRINCIPAL OPERATIONS

 TEST 14: Login as Principal

What to test: Get principal's JWT token

How to test:
1. Create a new request → POST
2. URL: `http://localhost:5000/api/auth/login`
3. Body (raw JSON):
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
4. Click Send

Expected Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Jane Principal",
    "role": "principal"
  }
}
```
Status: 200 OK ✅

🔴 IMPORTANT: Save this token!
- In your environment, add variable: `principal_token` = (paste this token)

---

 TEST 15: View All Content (Principal Only)

What to test: Can principal see all content from all teachers?

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/`
3. Headers:
   - Authorization: `Bearer {{principal_token}}`
4. Click Send

Expected Response:
```json
[
  {
    "id": 1,
    "title": "Maths Quiz 1",
    "description": "Chapter 1 quiz",
    "subject": "Maths",
    "file_url": "/uploads/1724000000000-image.jpg",
    "file_type": "image/jpeg",
    "file_size": 245678,
    "uploaded_by": 1,
    "status": "pending",
    "rejection_reason": null,
    "approved_by": null,
    "approved_at": null,
    "uploadedBy": {
      "name": "John Teacher",
      "email": "john@example.com"
    },
    "approvedBy": null
  }
]
```
Status: 200 OK ✅

---

 TEST 16: View Pending Content (Principal Only)

What to test: Can principal see only pending content awaiting approval?

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/pending`
3. Headers:
   - Authorization: `Bearer {{principal_token}}`
4. Click Send

Expected Response:
```json
[
  {
    "id": 1,
    "title": "Maths Quiz 1",
    "status": "pending",
    "uploadedBy": {
      "name": "John Teacher",
      "email": "john@example.com"
    }
  }
]
```
Status: 200 OK ✅

---

 TEST 17: Approve Content

What to test: Can principal approve pending content?

How to test:
1. Create a new request → PUT
2. URL: `http://localhost:5000/api/content/1/approve` (where 1 is the content ID)
3. Headers:
   - Authorization: `Bearer {{principal_token}}`
4. Click Send

Expected Response:
```json
{
  "message": "Content approved"
}
```
Status: 200 OK ✅

---

 TEST 18: Reject Content (with Reason)

What to test: Can principal reject content and provide rejection reason?

How to test:
1. First, upload another content piece as teacher (follow TEST 8 again)
2. Create a new request → PUT
3. URL: `http://localhost:5000/api/content/2/reject` (use new content ID)
4. Headers:
   - Authorization: `Bearer {{principal_token}}`
5. Body (raw JSON):
```json
{
  "rejection_reason": "The content quality is not suitable for students"
}
```
6. Click Send

Expected Response:
```json
{
  "message": "Content rejected"
}
```
Status: 200 OK ✅

---

 TEST 19: Reject without Reason

What to test: Should require rejection reason

How to test:
1. Upload another content as teacher
2. Create a new request → PUT
3. URL: `http://localhost:5000/api/content/3/reject`
4. Headers:
   - Authorization: `Bearer {{principal_token}}`
5. Body (raw JSON):
```json
{
  "rejection_reason": ""
}
```
6. Click Send

Expected Response:
```json
{
  "message": "Rejection reason is required"
}
```
Status: 400 Bad Request ✅

---

 TEST 20: Teacher Cannot Approve Content

What to test: Should prevent teacher from approving (role-based access)

How to test:
1. Create a new request → PUT
2. URL: `http://localhost:5000/api/content/1/approve`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}` (using teacher token, not principal!)
4. Click Send

Expected Response:
```json
{
  "message": "Forbidden"
}
```
Status: 403 Forbidden ✅

---

 SECTION 4: PUBLIC BROADCASTING API (No Auth Required)

 TEST 21: Get Live Content - Success Case

What to test: Can students get live content from a teacher?

Prerequisites: Make sure TEST 17 was completed (content ID 1 is approved)

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/live/1` (where 1 is teacher ID)
3. No Authorization header needed
4. Click Send

Expected Response:
```json
{
  "id": 1,
  "title": "Maths Quiz 1",
  "description": "Chapter 1 quiz",
  "subject": "Maths",
  "file_url": "/uploads/1724000000000-image.jpg",
  "file_type": "image/jpeg"
}
```
Status: 200 OK ✅

---

 TEST 22: Get Live Content - No Content Available

What to test: Should return "No content available" when teacher has no approved content

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/live/99` (non-existent or teacher with no content)
3. Click Send

Expected Response:
```json
{
  "message": "No content available"
}
```
Status: 200 OK ✅

---

 TEST 23: Get Live Content - Outside Time Window

What to test: Approved content shouldn't show if current time is outside start_time/end_time

How to test:
1. Upload a new content with past time window:
   - start_time: 2026-04-20T10:00:00Z
   - end_time: 2026-04-20T12:00:00Z
   - (dates in past)
2. Get principal token and approve it
3. Create a new request → GET
4. URL: `http://localhost:5000/api/live/1`
5. Click Send

Expected Response:
```json
{
  "message": "No content available"
}
```
Status: 200 OK ✅
(because current time is outside the window)

---

 TEST 24: Get Live Content - Invalid Teacher ID

What to test: Should handle invalid teacher ID

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/live/invalid`
3. Click Send

Expected Response:
```json
{
  "message": "Invalid teacher ID"
}
```
Status: 400 Bad Request ✅

---

 SECTION 5: SCHEDULING & ROTATION (Advanced Testing)

 TEST 25: Test Subject-based Rotation

What to test: Different subjects should have independent rotation cycles

How to test:

Step 1: Upload 3 Maths contents as teacher
1. POST to `/api/content/upload` with:
   - title: "Maths Content A"
   - subject: "Maths"
   - rotation_duration: 5
   - start_time: 2026-04-26T10:00:00Z
   - end_time: 2026-04-26T15:00:00Z
2. POST to `/api/content/upload` with:
   - title: "Maths Content B"
   - subject: "Maths"
   - rotation_duration: 5
   - start_time: 2026-04-26T10:00:00Z
   - end_time: 2026-04-26T15:00:00Z
3. POST to `/api/content/upload` with:
   - title: "Maths Content C"
   - subject: "Maths"
   - rotation_duration: 5
   - start_time: 2026-04-26T10:00:00Z
   - end_time: 2026-04-26T15:00:00Z

Step 2: Upload 2 Science contents as teacher
1. POST to `/api/content/upload` with:
   - title: "Science Content X"
   - subject: "Science"
   - rotation_duration: 3
   - start_time: 2026-04-26T10:00:00Z
   - end_time: 2026-04-26T15:00:00Z
2. POST to `/api/content/upload` with:
   - title: "Science Content Y"
   - subject: "Science"
   - rotation_duration: 3
   - start_time: 2026-04-26T10:00:00Z
   - end_time: 2026-04-26T15:00:00Z

Step 3: Approve all 5 contents as principal
- PUT to `/api/content/1/approve`
- PUT to `/api/content/2/approve`
- PUT to `/api/content/3/approve`
- PUT to `/api/content/4/approve`
- PUT to `/api/content/5/approve`

Step 4: Check live content
1. GET `/api/live/1`
2. Note which content is returned (should be one of the 5)
3. Rotation should cycle through:
   - Maths: A(0-5min) → B(5-10min) → C(10-15min) → A(15-20min)...
   - Science: X(0-3min) → Y(3-6min) → X(6-9min)...

Expected Behavior:
- Each subject rotates independently
- Maths rotates every 5 minutes
- Science rotates every 3 minutes
- Both respect their time windows

---

 SECTION 6: ERROR HANDLING & EDGE CASES

 TEST 26: Teacher Cannot View All Content

What to test: Should prevent teacher from seeing other teachers' content

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Click Send

Expected Response:
```json
{
  "message": "Forbidden"
}
```
Status: 403 Forbidden ✅

---

 TEST 27: Teacher Cannot View Pending Content

What to test: Should prevent teacher from approving workflows

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/pending`
3. Headers:
   - Authorization: `Bearer {{teacher_token}}`
4. Click Send

Expected Response:
```json
{
  "message": "Forbidden"
}
```
Status: 403 Forbidden ✅

---

 TEST 28: Invalid Token Should Fail

What to test: Should reject malformed or invalid tokens

How to test:
1. Create a new request → GET
2. URL: `http://localhost:5000/api/content/my`
3. Headers:
   - Authorization: `Bearer invalid.token.here`
4. Click Send

Expected Response:
```json
{
  "message": "Invalid token"
}
```
Status: 401 Unauthorized ✅

---

 SUMMARY TABLE

| Test  | Feature | Status | Expected |
|---|---|---|---|
| 1 | Register Teacher | ✅ | 201 Created |
| 2 | Register Principal | ✅ | 201 Created |
| 3 | Invalid Role | ✅ | 400 Bad Request |
| 4 | Duplicate Email | ✅ | 400 Bad Request |
| 5 | Login Success | ✅ | 200 OK |
| 6 | Wrong Password | ✅ | 401 Unauthorized |
| 7 | Non-existent User | ✅ | 401 Unauthorized |
| 8 | Upload Valid File | ✅ | 201 Created |
| 9 | Missing Fields | ✅ | 400 Bad Request |
| 10 | Invalid File Type | ✅ | 400 Bad Request |
| 11 | File Too Large | ✅ | 400 Bad Request |
| 12 | No Token | ✅ | 401 Unauthorized |
| 13 | View Own Content | ✅ | 200 OK |
| 14 | Principal Login | ✅ | 200 OK |
| 15 | View All Content | ✅ | 200 OK |
| 16 | View Pending | ✅ | 200 OK |
| 17 | Approve Content | ✅ | 200 OK |
| 18 | Reject Content | ✅ | 200 OK |
| 19 | Reject No Reason | ✅ | 400 Bad Request |
| 20 | Teacher Cannot Approve | ✅ | 403 Forbidden |
| 21 | Get Live Content | ✅ | 200 OK |
| 22 | No Content Available | ✅ | 200 OK |
| 23 | Outside Time Window | ✅ | 200 OK |
| 24 | Invalid Teacher ID | ✅ | 400 Bad Request |
| 25 | Subject Rotation | ✅ | Correct rotation |
| 26 | Teacher Cannot View All | ✅ | 403 Forbidden |
| 27 | Teacher Cannot Approve | ✅ | 403 Forbidden |
| 28 | Invalid Token | ✅ | 401 Unauthorized |

---

 🎯 Quick Testing Checklist

✅ All 28 tests pass
✅ Authentication works (JWT)
✅ RBAC works (roles enforced)
✅ File upload works (with validation)
✅ Approval workflow works
✅ Scheduling/rotation works
✅ Public API works
✅ Edge cases handled
✅ Error messages clear

Ready for submission! 🚀

