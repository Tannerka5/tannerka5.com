# S3 Secure File Upload Setup Guide

This guide explains how to set up secure file uploads to AWS S3 for authenticated users on tannerka5.com.

## Overview

The implementation uses AWS S3 pre-signed URLs to enable secure, authenticated file uploads. Files are organized by user ID in the S3 bucket structure: `uploads/{userId}/{timestamp}-{filename}`.

## Features

- ✅ Authentication required for uploads
- ✅ Pre-signed URLs (15-minute expiration)
- ✅ File size validation (max 10MB)
- ✅ Upload progress tracking
- ✅ User-specific file organization
- ✅ TypeScript type safety

## Prerequisites

1. AWS Account with S3 bucket: `tannerka5-portfolio-upload`
2. AWS IAM user with S3 write permissions
3. Existing authentication system (JWT-based)
4. Node.js and npm installed

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the `backend/` directory (or configure in your Lambda environment):

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Required environment variables:

```env
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-2
S3_BUCKET=tannerka5-portfolio-upload
UPLOADS_PREFIX=uploads/
JWT_SECRET=your-jwt-secret-key
```

### 2. AWS IAM Permissions

Your Lambda execution role needs the following S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::tannerka5-portfolio-upload/uploads/*"
    }
  ]
}
```

### 3. S3 Bucket Configuration

Ensure your S3 bucket has the following configuration:

**Bucket Policy** (for public read access):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tannerka5-portfolio-upload/*"
    }
  ]
}
```

**CORS Configuration**:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["https://tannerka5.com", "https://www.tannerka5.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 4. Deploy Backend

```bash
cd backend
npm install
npm run build
# Deploy to Lambda (use your deployment method)
```

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `frontend-new/` directory:

```bash
# Copy the example file
cp frontend-new/.env.example frontend-new/.env
```

Required environment variables (must be prefixed with `PUBLIC_` in Astro):

```env
PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-2.amazonaws.com/prod
```

### 2. Install Dependencies

Dependencies are already included in `package.json`. If needed:

```bash
cd frontend-new
npm install
```

## Usage

### Using the FileUpload Component

The `FileUpload` component is already integrated into your admin pages. Here's how to use it:

```tsx
import FileUpload from './components/admin/FileUpload';

<FileUpload
  currentUrl={existingFileUrl}
  onUploadComplete={(url) => {
    console.log('File uploaded:', url);
    // Save the URL to your data
  }}
  accept="image/*"
  label="Upload Image"
  maxSize={10 * 1024 * 1024} // Optional: override default 10MB
/>
```

### Component Props

- `currentUrl?: string` - Current file URL to display
- `onUploadComplete: (url: string) => void` - Callback when upload completes
- `accept?: string` - File type filter (default: `'image/*'`)
- `label?: string` - Label text (default: `'Upload File'`)
- `className?: string` - Additional CSS classes
- `maxSize?: number` - Maximum file size in bytes (default: 10MB)

### API Client Usage

You can also use the API client directly:

```tsx
import { apiClient } from './lib/api';

// Get pre-signed URL
const { uploadUrl, url, key, expiresIn } = await apiClient.getUploadUrl(
  file.name,
  file.type,
  file.size
);

// Upload file to S3
const response = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type,
  },
});
```

## File Organization

Files are stored in S3 with the following structure:

```
uploads/
  {userId}/
    {timestamp}-{filename}
```

Example:
```
uploads/
  abc123-user-id/
    1704067200000-project-logo.png
    1704067300000-hero-image.jpg
```

## Security Features

1. **Authentication Required**: All upload requests require a valid JWT token
2. **Pre-signed URLs**: URLs expire after 15 minutes
3. **File Size Validation**: Maximum 10MB per file (configurable)
4. **Filename Sanitization**: Prevents path traversal attacks
5. **User Isolation**: Files are organized by user ID

## Error Handling

The component handles various error scenarios:

- **Unauthorized**: User not logged in
- **File Too Large**: Exceeds maximum size limit
- **Network Errors**: Connection issues during upload
- **Upload Failures**: S3 upload errors

All errors are displayed to the user with clear messages.

## Testing

### Test Upload Flow

1. Log in to the admin dashboard
2. Navigate to a project or blog post editor
3. Click "Choose File" in any file upload field
4. Select a file (under 10MB)
5. Watch the upload progress
6. Verify the file URL is displayed after upload

### Test Error Cases

- Try uploading without being logged in
- Try uploading a file larger than 10MB
- Try uploading with an invalid token

## Troubleshooting

### Upload Fails with 401 Unauthorized

- Check that you're logged in
- Verify JWT token is valid
- Check backend authentication middleware

### Upload Fails with 400 Bad Request

- Verify file size is under 10MB
- Check that filename and contentType are provided
- Review backend logs for specific error

### CORS Errors

- Verify S3 bucket CORS configuration
- Check that your domain is in the allowed origins
- Ensure API Gateway CORS headers are configured

### Files Not Accessible

- Check S3 bucket policy allows public read
- Verify file URL format matches bucket region
- Check file permissions in S3

## API Endpoint

**POST** `/upload`

**Headers:**
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "filename": "example.jpg",
  "contentType": "image/jpeg",
  "fileSize": 1024000
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "url": "https://tannerka5-portfolio-upload.s3.us-east-2.amazonaws.com/uploads/user-id/timestamp-filename.jpg",
  "key": "uploads/user-id/timestamp-filename.jpg",
  "expiresIn": 900
}
```

## Environment Variables Reference

### Backend (Lambda)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | Yes | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | - | AWS secret key |
| `AWS_REGION` | No | `us-east-2` | AWS region |
| `S3_BUCKET` | No | `tannerka5-portfolio-upload` | S3 bucket name |
| `UPLOADS_PREFIX` | No | `uploads/` | S3 key prefix |
| `JWT_SECRET` | Yes | - | JWT signing secret |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PUBLIC_API_URL` | No | `https://api.tannerka5.com` | API Gateway URL |

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend Lambda logs
3. Check browser console for frontend errors
4. Verify AWS S3 bucket configuration
