# Redeploy Lambda Function with Upload Handler

The upload endpoint code is already in your `handler.ts` file, but it needs to be deployed to Lambda.

## Steps to Redeploy

### 1. Build the TypeScript Code

```bash
cd backend
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 2. Package for Lambda

```bash
npm run package
```

This will:

- Build the TypeScript
- Create a zip file with `dist/` and `node_modules/`

Or manually:

```bash
npm run build
npm run zip
```

### 3. Upload to Lambda

**Option A: Using AWS Console**

1. Go to Lambda → Functions → `portfolio-api` (or your function name)
2. Scroll down to "Code source"
3. Click "Upload from" → ".zip file"
4. Select the `lambda.zip` file from `backend/` directory
5. Click "Save"
6. Wait for upload to complete

**Option B: Using AWS CLI**

```bash
aws lambda update-function-code \
  --function-name portfolio-api \
  --zip-file fileb://lambda.zip \
  --region us-east-2
```

**Option C: Using your deployment script**
If you have a deployment script, use that.

### 4. Verify Deployment

1. Go to Lambda function → Code tab
2. Check the "Last modified" timestamp - should be recent
3. Check the handler: Should be `handler.handler` (or `dist/handler.handler`)

### 5. Test the Upload Endpoint

After deployment, test from browser console:

```javascript
fetch("https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod/upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("admin_token"),
  },
  body: JSON.stringify({
    filename: "test.jpg",
    contentType: "image/jpeg",
    fileSize: 1000,
  }),
})
  .then((r) => {
    console.log("Status:", r.status);
    return r.json();
  })
  .then(console.log)
  .catch(console.error);
```

Should return 200 with `uploadUrl`, `url`, `key`, and `expiresIn` fields.

## Verify Code is Deployed

Check Lambda function code to verify:

1. Go to Lambda → Functions → your function
2. In the code editor, search for "getUploadUrl" or "UPLOADS"
3. Should see the upload handler function

If you don't see it, the deployment didn't include the latest code.

## Troubleshooting

### Build Errors

If `npm run build` fails:

- Check TypeScript errors
- Verify all imports are correct
- Make sure `tsconfig.json` is configured properly

### Package Too Large

If the zip file is too large (>50MB for direct upload):

- Remove `node_modules` from zip if using Lambda layers
- Or use S3 upload method:
  ```bash
  aws s3 cp lambda.zip s3://your-bucket/lambda.zip
  aws lambda update-function-code \
    --function-name portfolio-api \
    --s3-bucket your-bucket \
    --s3-key lambda.zip
  ```

### Handler Not Found

If Lambda says handler not found:

- Check handler name in Lambda configuration
- Should be: `handler.handler` (file: handler, function: handler)
- Or: `dist/handler.handler` if using dist folder

## Quick Command Summary

```bash
cd backend
npm run build          # Compile TypeScript
npm run package        # Create zip file
# Then upload lambda.zip to Lambda via console or CLI
```
