# Troubleshooting 404 Error on /upload Route

## Issue
The API Gateway route `/upload` was successfully configured and tested (returns 401 when tested in console), but browser requests still get 404.

## Possible Causes & Solutions

### 1. API Gateway Deployment Propagation Delay
**Symptom**: Route works in API Gateway test console but not from browser

**Solution**: 
- Wait 1-2 minutes for deployment to fully propagate
- Try clearing browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check if there are multiple API Gateway deployments - ensure the latest one is active

### 2. Environment Variable Not Set
**Symptom**: Frontend is using wrong API URL

**Check**: 
1. Open browser console and look for: `[API Client] API Base URL: ...`
2. Verify it shows: `https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod`
3. If it shows `https://api.tannerka5.com`, the environment variable isn't set

**Fix**:
1. Create `.env` file in `frontend-new/` directory:
   ```
   PUBLIC_API_URL=https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod
   ```
2. Rebuild the frontend:
   ```bash
   cd frontend-new
   npm run build
   ```
3. Redeploy the frontend

### 3. CloudFront/CDN Caching
**Symptom**: 404 responses are being cached

**Solution**:
- Clear CloudFront cache if you have one
- Try accessing the API directly (bypassing CDN)
- Add cache-busting headers or query parameters for testing

### 4. API Gateway Stage Mismatch
**Symptom**: Route exists but on wrong stage

**Check**:
1. Go to API Gateway → Resources
2. Verify `/upload` resource exists
3. Click on `/upload` → POST method
4. Check the Integration Request - verify Lambda function is connected
5. Go to Actions → Deploy API
6. Verify `prod` stage is selected and has recent deployment

### 5. CORS Preflight Issue
**Symptom**: OPTIONS request might be failing

**Check**:
1. In browser DevTools → Network tab
2. Look for OPTIONS request to `/upload`
3. If OPTIONS returns 404, that's the issue

**Fix**:
- Ensure OPTIONS method exists on `/upload` resource
- CORS should have been auto-configured, but verify:
  - Actions → Enable CORS on `/upload` resource
  - Ensure OPTIONS method is created

### 6. URL Construction Issue
**Symptom**: Double slashes or incorrect path

**Check Browser Console**:
After the code update, you should see:
```
[API Client] Upload request: {
  endpoint: "/upload",
  fullUrl: "https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod/upload",
  apiBaseUrl: "https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod",
  hasToken: true
}
```

**Verify**:
- `fullUrl` should be exactly: `https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod/upload`
- No double slashes
- `hasToken` should be `true` if logged in

## Quick Diagnostic Steps

1. **Check Browser Console**:
   - Look for `[API Client] Upload request:` log
   - Check the `fullUrl` value
   - Check Network tab for the actual request URL

2. **Test Direct API Call**:
   Open browser console and run:
   ```javascript
   fetch('https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod/upload', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_TOKEN_HERE'
     },
     body: JSON.stringify({
       filename: 'test.jpg',
       contentType: 'image/jpeg',
       fileSize: 1000
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```
   Replace `YOUR_TOKEN_HERE` with your actual JWT token from localStorage

3. **Check API Gateway Logs**:
   - Go to CloudWatch → Log Groups
   - Find your API Gateway log group
   - Look for recent requests to `/upload`
   - Check if requests are reaching API Gateway

4. **Verify Route in API Gateway**:
   - Go to API Gateway → Resources
   - Click on `/upload`
   - Verify POST method exists
   - Click on POST → Integration Request
   - Verify Lambda function is connected
   - Check if there are any errors

## Most Likely Fix

Based on the symptoms, the most likely issue is:

**Missing Environment Variable**: The frontend is using the default API URL instead of the actual API Gateway URL.

**Quick Fix**:
1. Create `frontend-new/.env` file:
   ```
   PUBLIC_API_URL=https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod
   ```

2. Rebuild and redeploy:
   ```bash
   cd frontend-new
   npm run build
   # Deploy (use your deployment method)
   ```

3. Clear browser cache and test again

## Verify Fix

After applying the fix, check browser console:
- Should see: `[API Client] API Base URL: https://bagyqubc43.execute-api.us-east-1.amazonaws.com/prod`
- Upload request should show correct `fullUrl`
- Should get 401 (if not logged in) or 200 (if logged in with valid token), NOT 404
