# Alumni Connect Backend API Documentation

## Overview
This document provides a comprehensive overview of the implemented backend functionality for the Alumni Connect platform.

## Files Created/Modified

### New Files Created:
1. `backend/src/middleware/upload.js` - Multer configuration for file uploads
2. `backend/src/config/cloudinary.js` - Cloudinary integration for cloud storage
3. `backend/src/controllers/postController.js` - Post management controller
4. `backend/src/routes/postRoutes.js` - Post API routes

### Modified Files:
1. `backend/src/controllers/authController.js` - Enhanced with file upload support
2. `backend/src/routes/authRoutes.js` - Added file upload middleware
3. `backend/src/server.js` - Integrated post routes

## Environment Variables Required

Add these to your `.env` file:

```env
# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

Before running the server, install dependencies:

```bash
cd backend
npm install
```

The following packages are already listed in `package.json`:
- multer (^1.4.5-lts.1)
- cloudinary (^1.41.0)
- express (^4.18.2)
- mongoose (^8.0.3)
- bcryptjs (^2.4.3)
- jsonwebtoken (^9.0.2)

## API Endpoints

### Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - Required: `firstName`, `lastName`, `email`, `password`, `role`, `batch`
  - Optional: `enrollmentNumber`, `phone`, `currentRole`, `company`, `location`, `skills` (JSON array), `linkedinUrl`, `githubUrl`, `portfolioUrl`, `bio`, `department`, `mentorshipAvailable`, `mentorshipDomains` (JSON array)
  - Files: `profilePicture` (image), `idCard` (PDF/image)
- **Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student" or "alumni"
}
```

#### 3. Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Access:** Private (requires Bearer token)
- **Headers:** `Authorization: Bearer <token>`

#### 4. Logout
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Private

#### 5. Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Access:** Public
- **Body:**
```json
{
  "email": "user@example.com",
  "role": "student" or "alumni"
}
```

#### 6. Reset Password
- **Endpoint:** `POST /api/auth/reset-password`
- **Access:** Public
- **Body:**
```json
{
  "token": "reset_token",
  "password": "newpassword123",
  "role": "student" or "alumni"
}
```

#### 7. Update Password
- **Endpoint:** `PUT /api/auth/update-password`
- **Access:** Private
- **Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Post Endpoints

All post endpoints require authentication (Bearer token).

#### 1. Create Post
- **Endpoint:** `POST /api/posts`
- **Access:** Private
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - Required: `content`
  - Optional: `title`, `type` (general/advice/achievement/job), `visibility` (public/connections/private), `jobDetails` (JSON object)
  - Files: `images[]` (up to 5 images)
- **Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "...",
    "author": {...},
    "content": "...",
    "images": [...],
    "likes": [],
    "comments": [],
    "createdAt": "..."
  }
}
```

#### 2. Get All Posts
- **Endpoint:** `GET /api/posts`
- **Access:** Private
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `type` (filter by post type)
  - `author` (filter by author ID)
- **Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 50,
      "postsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 3. Get Single Post
- **Endpoint:** `GET /api/posts/:id`
- **Access:** Private
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "author": {...},
    "content": "...",
    "images": [...],
    "likes": [...],
    "comments": [...],
    "views": 10,
    "createdAt": "..."
  }
}
```

#### 4. Update Post
- **Endpoint:** `PUT /api/posts/:id`
- **Access:** Private (only post author)
- **Body:**
```json
{
  "content": "Updated content",
  "title": "Updated title",
  "type": "advice",
  "visibility": "public"
}
```

#### 5. Delete Post
- **Endpoint:** `DELETE /api/posts/:id`
- **Access:** Private (only post author)
- **Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

#### 6. Like/Unlike Post
- **Endpoint:** `POST /api/posts/:id/like`
- **Access:** Private
- **Response:**
```json
{
  "success": true,
  "message": "Post liked" or "Post unliked",
  "data": {
    "postId": "...",
    "likeCount": 5,
    "isLiked": true
  }
}
```

#### 7. Comment on Post
- **Endpoint:** `POST /api/posts/:id/comment`
- **Access:** Private
- **Body:**
```json
{
  "content": "This is a comment"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "...",
    "user": {...},
    "content": "...",
    "likes": [],
    "createdAt": "..."
  }
}
```

#### 8. Like/Unlike Comment
- **Endpoint:** `POST /api/posts/:id/comments/:commentId/like`
- **Access:** Private
- **Response:**
```json
{
  "success": true,
  "message": "Comment liked" or "Comment unliked",
  "data": {
    "commentId": "...",
    "likeCount": 3,
    "isLiked": true
  }
}
```

#### 9. Delete Comment
- **Endpoint:** `DELETE /api/posts/:id/comments/:commentId`
- **Access:** Private (comment author or post author)
- **Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## File Upload Specifications

### Supported File Types:
- **Images:** JPG, JPEG, PNG, WEBP
- **Documents:** PDF

### File Size Limits:
- **Images:** 5MB (enforced by Cloudinary transformations)
- **PDFs:** 10MB
- **Max file size (multer):** 10MB

### Upload Locations (Cloudinary folders):
- Profile pictures: `alumni-connect/profiles`
- ID cards: `alumni-connect/documents`
- Post images: `alumni-connect/posts`

### Image Transformations:
- **Profile Pictures:** 500x500px, cropped to face, auto quality & format
- **Post Images:** Max 1200x1200px, auto quality & format
- **ID Cards:** No transformation, stored as-is

## Database Collections

### User Data:
- **Students:** Stored in `Student Data` collection
- **Alumni:** Stored in `Alumni Data` collection

Both use the same schema from `User.js` but are stored in separate collections based on the `role` field.

### Post Data:
- **Collection:** `posts`
- **Model:** `Post` (from `Post.js`)

## Security Features

1. **Authentication:** JWT-based authentication with access and refresh tokens
2. **Authorization:** Role-based access control (student/alumni)
3. **File Validation:** Type and size validation for uploads
4. **Rate Limiting:** 100 requests per 15 minutes per IP
5. **Helmet:** Security headers
6. **CORS:** Configured for frontend URL
7. **Password Hashing:** bcrypt with salt rounds
8. **Error Handling:** Comprehensive error handling with meaningful messages

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Descriptive message",
  "data": {...} // Only for successful responses
}
```

## Error Handling

### Common Error Codes:
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/expired token, wrong credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing the API

### Using Postman:

1. **Register a User:**
   - Set method to POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body type: form-data
   - Add fields and files as needed

2. **Login:**
   - Set method to POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body type: raw (JSON)
   - Copy the accessToken from response

3. **Create Post:**
   - Set method to POST
   - URL: `http://localhost:5000/api/posts`
   - Headers: `Authorization: Bearer <your_token>`
   - Body type: form-data
   - Add content and images

4. **Get Posts:**
   - Set method to GET
   - URL: `http://localhost:5000/api/posts?page=1&limit=10`
   - Headers: `Authorization: Bearer <your_token>`

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Next Steps

To complete the setup:

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Set up a Cloudinary account and add credentials
4. Set up MongoDB database
5. Start the server: `npm run dev`

## Notes

- All protected routes require a valid JWT token in the Authorization header
- Files are stored in Cloudinary, not locally
- User data is automatically stored in the correct collection based on role
- Images are automatically optimized and transformed by Cloudinary
- Post images are limited to 5 per post
- Comments can be liked and deleted
- Posts can only be edited/deleted by their authors
- The API uses pagination for listing posts (default 10 per page)
