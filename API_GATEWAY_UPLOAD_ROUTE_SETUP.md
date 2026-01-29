# API Gateway Upload Route Configuration

## Problem

You're getting a 404 error when trying to upload files because API Gateway doesn't have a route configured for `/upload`.

## Solution

You need to add a route in API Gateway for `POST /upload` (or `POST /{proxy+}` if using a catch-all proxy).

## Option 1: Add Specific `/upload` Route (Recommended)

1. Go to AWS API Gateway Console
2. Select your API (the one with endpoint `bagyqubc43.execute-api.us-east-1.amazonaws.com`)
3. Navigate to **Resources**
4. Click **Actions** → **Create Resource**
5. Configure:
   - **Resource Path**: `upload`
   - **Enable API Gateway CORS**: Yes (if needed)
6. Click **Create Resource**
7. With the new `/upload` resource selected, click **Actions** → **Create Method**
8. Select **POST** from the dropdown
9. Configure:
   - **Integration type**: Lambda Function
   - **Use Lambda Proxy integration**: ✅ Check this box
   - **Lambda Function**: Select your Lambda function (the one handling your API)
   - **Use Default Timeout**: ✅ Check this box
10. Click **Save** and confirm when prompted
11. **Deploy** the API:
    - Click **Actions** → **Deploy API**
    - Select your stage (e.g., `prod`)
    - Click **Deploy**

## Option 2: Use Proxy Route (If Already Configured)

If you already have a `/{proxy+}` route configured that catches all requests:

1. The Lambda code should already handle it (it checks for `/upload` in the path)
2. Make sure the `/{proxy+}` route is configured with:
   - **Integration type**: Lambda Function
   - **Use Lambda Proxy integration**: ✅ Enabled
   - Points to your Lambda function

3. After updating the Lambda code, redeploy:
   ```bash
   cd backend
   npm run build
   # Deploy to Lambda (use your deployment method)
   ```

## Option 3: Update Existing Proxy Route

If you have a proxy route but it's not working:

1. Go to API Gateway → Resources
2. Find the `/{proxy+}` route
3. Click on the **POST** method (or **ANY** method)
4. Verify:
   - Integration type is **Lambda Function**
   - **Lambda Proxy integration** is enabled
   - Lambda function is correctly selected
5. Click **Save**
6. **Deploy** the API to your stage

## Verify Configuration

After setting up the route:

1. Test in API Gateway Console:
   - Go to the `/upload` resource (or `/{proxy+}`)
   - Click on **POST** method
   - Click **TEST**
   - Set:
     - **Request Body**: `{"filename":"test.jpg","contentType":"image/jpeg","fileSize":1000}`
     - **Headers**: `Authorization: Bearer YOUR_TOKEN`
   - Click **Test**
   - Should return a pre-signed URL, not a 404

2. Test from browser:
   - Try uploading a file again
   - Check browser console - should not see 404 error
   - Check Lambda CloudWatch logs for the debug messages

## Troubleshooting

### Still Getting 404

1. **Check API Gateway Routes**:
   - Verify the route exists in API Gateway
   - Check that it's deployed to the correct stage (`prod`)

2. **Check Lambda Integration**:
   - Verify Lambda function name is correct
   - Check Lambda function has proper permissions

3. **Check Path Matching**:
   - The Lambda code checks for `/upload` in the path
   - With stage prefix, path will be `/prod/upload`
   - The code should handle this with `path.includes('/upload')`

4. **Check CloudWatch Logs**:
   - Look for the debug messages:
     - "Path info: ..."
     - "Upload endpoint matched, path: ..."
   - If you don't see these, the request isn't reaching Lambda

### Getting 401 Unauthorized

- This is expected if you're not logged in
- Make sure you're logged in to the admin dashboard
- Check that the JWT token is being sent in the Authorization header

### Getting 500 Internal Server Error

- Check Lambda CloudWatch logs for error details
- Verify environment variables are set:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION=us-east-2`
  - `S3_BUCKET=tannerka5-portfolio-upload`

## Quick Test Command

After configuring, test with curl:

```bash
curl -X POST https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"filename":"test.jpg","contentType":"image/jpeg","fileSize":1000}'
```

Should return JSON with `uploadUrl`, `url`, `key`, and `expiresIn` fields.
