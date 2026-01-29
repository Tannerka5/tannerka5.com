# Verify Upload Route Configuration

Please use browser control to verify the `/upload` route is properly configured and deployed.

## Critical Checks

### 1. Verify Route Exists and is Deployed
1. Go to API Gateway → portfolio-api (bagyqubc43)
2. Click on **Resources** in left sidebar
3. Look for `/upload` resource in the resource tree
4. Click on `/upload` resource
5. Verify **POST** method exists
6. Click on **POST** method
7. Check:
   - Integration type: Should be "Lambda Function"
   - Lambda Proxy integration: Should be ENABLED
   - Lambda Function: Should show `portfolio-api` (or the correct function name)
   - Region: Should show `us-east-2` (Lambda region)

### 2. Check Deployment Status
1. Click **Actions** → **Deploy API**
2. Check the deployment history:
   - Look at the most recent deployment
   - Verify it says "prod" stage
   - Check the deployment description
   - Note the deployment date/time
3. If the most recent deployment doesn't mention `/upload`, we need to redeploy

### 3. Verify Stage Configuration
1. Click on **Stages** in left sidebar
2. Click on **prod** stage
3. Look at the stage editor
4. Check the **Resources** section - does it show `/upload`?
5. Expand the resources tree - verify `/upload` → POST is listed
6. If `/upload` is NOT listed, the route isn't deployed to this stage

### 4. Test the Route Again
1. Go back to **Resources** → `/upload` → **POST**
2. Click **TEST** button
3. Set:
   - **Request Body**: `{"filename":"test.jpg","contentType":"image/jpeg","fileSize":1000}`
   - **Headers**: `Authorization: Bearer test` (we just want to see if route works)
4. Click **Test**
5. Expected: Should get 401 (unauthorized) - this confirms route works
6. If you get 404, the route isn't properly configured

### 5. Check for Proxy Route Interference
1. In **Resources**, look for a `/{proxy+}` resource
2. If it exists, check:
   - Does it have POST or ANY method?
   - What Lambda function is it connected to?
   - Is it deployed to `prod` stage?
3. If `/{proxy+}` exists and is deployed, it might be catching the request before `/upload`
4. Check the resource order - more specific routes should come before proxy routes

### 6. Redeploy if Needed
If `/upload` route exists but isn't showing in the `prod` stage:

1. Go to **Resources**
2. Click **Actions** → **Deploy API**
3. Select **Deployment stage**: `prod`
4. **Deployment description**: "Redeploy with /upload route"
5. Click **Deploy**
6. Wait 30 seconds
7. Go back to **Stages** → **prod** → verify `/upload` now appears

## Report Back

Please tell me:
1. ✅ Does `/upload` resource exist? (Yes/No)
2. ✅ Does POST method exist on `/upload`? (Yes/No)
3. ✅ Is POST method connected to Lambda? (Yes/No - which function?)
4. ✅ Is `/upload` listed in `prod` stage resources? (Yes/No)
5. ✅ What does the TEST button return? (Status code and response)
6. ✅ Does `/{proxy+}` route exist? (Yes/No - if yes, what's configured?)
7. ✅ When was the last deployment to `prod`? (Date/time)

## If Route is Missing from Stage

If `/upload` exists in Resources but NOT in the `prod` stage:

**This is the problem!** The route needs to be redeployed.

**Fix**:
1. Go to Resources → Actions → Deploy API
2. Select `prod` stage
3. Add description: "Deploy /upload route to prod"
4. Click Deploy
5. Wait 1-2 minutes for propagation
6. Test again from browser

## If Proxy Route is Interfering

If `/{proxy+}` exists and is catching requests:

**Option A**: Make sure `/upload` is more specific (it should be, but verify order)
**Option B**: Temporarily disable `/{proxy+}` POST method to test
**Option C**: The Lambda code should handle both - verify Lambda is updated
