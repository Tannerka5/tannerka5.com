# S3 Secure File Upload Implementation Summary

## What Was Implemented

This document summarizes the secure S3 file upload implementation for tannerka5.com.

## Backend Changes

### Updated Files

1. **`backend/src/handler.ts`**
   - Updated `getUploadUrl` function to:
     - Use correct S3 bucket: `tannerka5-portfolio-upload`
     - Organize files by user ID: `uploads/{userId}/{timestamp}-{filename}`
     - Add file size validation (max 10MB)
     - Set pre-signed URL expiration to 15 minutes (900 seconds)
     - Extract userId from JWT token for file organization
     - Sanitize filenames to prevent path traversal
     - Use correct AWS region (us-east-2) in S3 client and public URLs

### Key Features

- ✅ Authentication verification using existing JWT system
- ✅ File size validation (10MB maximum)
- ✅ User-specific file organization
- ✅ Filename sanitization
- ✅ 15-minute pre-signed URL expiration
- ✅ Proper error handling and responses

## Frontend Changes

### New Files

1. **`frontend-new/src/types/upload.ts`**
   - TypeScript type definitions for upload functionality
   - `UploadUrlRequest`, `UploadUrlResponse`, `UploadProgress`, `UploadState`

### Updated Files

1. **`frontend-new/src/lib/api.ts`**
   - Updated `getUploadUrl` method to include `fileSize` parameter
   - Added proper TypeScript return types

2. **`frontend-new/src/components/admin/FileUpload.tsx`**
   - Added authentication check (hides upload UI if not logged in)
   - Implemented upload progress tracking with visual progress bar
   - Enhanced error handling with user-friendly messages
   - Added file size validation on frontend
   - Display uploaded file URL with copy button
   - Improved UI with progress indicators
   - Added accessibility attributes (ARIA labels, titles)

### Key Features

- ✅ Authentication check before showing upload UI
- ✅ Real-time upload progress tracking
- ✅ Visual progress bar with percentage and file size
- ✅ Comprehensive error handling
- ✅ File size validation (client-side)
- ✅ Uploaded URL display with copy functionality
- ✅ Responsive and accessible UI

## Environment Variables

### Backend (Lambda)

Required environment variables:

```env
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-2
S3_BUCKET=tannerka5-portfolio-upload
UPLOADS_PREFIX=uploads/
JWT_SECRET=your-jwt-secret-key
```

### Frontend

Required environment variables (must be prefixed with `PUBLIC_` in Astro):

```env
PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-2.amazonaws.com/prod
```

## File Organization Structure

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

## API Endpoint

**Endpoint:** `POST /upload`

**Authentication:** Required (Bearer token in Authorization header)

**Request:**
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

## Usage Example

The `FileUpload` component is already integrated into:
- `ProjectEditor.tsx` (for project logos and media)
- `BlogPostEditor.tsx` (for blog post images)
- `SimpleRichTextEditor.tsx` (for rich text editor images)

### Standalone Usage

```tsx
import FileUpload from './components/admin/FileUpload';

<FileUpload
  currentUrl={existingFileUrl}
  onUploadComplete={(url) => {
    // Handle the uploaded file URL
    console.log('File uploaded:', url);
  }}
  accept="image/*"
  label="Upload Image"
  maxSize={10 * 1024 * 1024} // Optional: override default 10MB
/>
```

## Security Features

1. **Authentication Required**: All uploads require valid JWT token
2. **Pre-signed URLs**: URLs expire after 15 minutes
3. **File Size Validation**: Maximum 10MB (configurable)
4. **Filename Sanitization**: Prevents path traversal attacks
5. **User Isolation**: Files organized by user ID
6. **CORS Protection**: S3 bucket configured for specific origins

## Testing Checklist

- [ ] Upload file while logged in (should work)
- [ ] Upload file while not logged in (should show login message)
- [ ] Upload file larger than 10MB (should show error)
- [ ] Upload progress displays correctly
- [ ] Uploaded URL is displayed and copyable
- [ ] File appears in S3 bucket under correct user folder
- [ ] File is accessible via public URL
- [ ] Pre-signed URL expires after 15 minutes

## Next Steps

1. Set environment variables in Lambda function
2. Verify S3 bucket CORS configuration
3. Test upload flow end-to-end
4. Monitor S3 bucket usage and costs
5. Consider adding file type validation (if needed)
6. Consider adding image optimization (if needed)

## Documentation

See `S3_UPLOAD_SETUP.md` for detailed setup instructions.
