# Prompt for Claude to Configure API Gateway Upload Route

Copy and paste this prompt to Claude (with browser control):

---

I need you to help me configure an AWS API Gateway route for file uploads. Please use browser control to navigate AWS and set this up.

## Context
- My API Gateway endpoint: `bagyqubc43.execute-api.us-east-1.amazonaws.com`
- Stage: `prod`
- I need to add a `POST /upload` route that connects to my existing Lambda function
- The Lambda function already handles the `/upload` endpoint logic

## Task: Add POST /upload Route to API Gateway

### Step 1: Navigate to API Gateway
1. Go to AWS Console (console.aws.amazon.com)
2. Navigate to API Gateway service
3. Find the API that corresponds to endpoint `bagyqubc43.execute-api.us-east-1.amazonaws.com`
   - Look for an API with this endpoint or check the API ID/stage configuration
   - The API might be named something like "portfolio-api" or similar

### Step 2: Create /upload Resource
1. In the API Gateway console, click on **Resources** in the left sidebar
2. Look at the existing resource structure
3. Click **Actions** → **Create Resource**
4. Configure:
   - **Resource Path**: `upload`
   - **Resource Name**: `upload` (or leave default)
   - **Enable API Gateway CORS**: Check this box if you see it (or we'll configure CORS later)
5. Click **Create Resource**

### Step 3: Create POST Method
1. With the new `/upload` resource selected, click **Actions** → **Create Method**
2. In the method dropdown, select **POST**
3. Click the checkmark to confirm
4. Configure the integration:
   - **Integration type**: Select **Lambda Function**
   - **Use Lambda Proxy integration**: ✅ **CHECK THIS BOX** (very important!)
   - **Lambda Region**: Select the region (likely `us-east-1` based on the endpoint)
   - **Lambda Function**: 
     - Type or search for your Lambda function name
     - Look for a function that handles your portfolio API (might be named something like "portfolio-handler", "api-handler", or similar)
     - If you see multiple functions, look for one that's already connected to other API Gateway routes
   - **Use Default Timeout**: ✅ Check this box
5. Click **Save**
6. If prompted about adding permissions, click **OK** or **Yes** to allow API Gateway to invoke the Lambda function

### Step 4: Configure CORS (if needed)
1. With the `/upload` resource selected, click **Actions** → **Enable CORS**
2. Review the CORS settings:
   - **Access-Control-Allow-Origin**: Should include your domain (e.g., `https://tannerka5.com`)
   - **Access-Control-Allow-Headers**: Should include `Content-Type,Authorization`
   - **Access-Control-Allow-Methods**: Should include `POST,OPTIONS`
3. Click **Enable CORS and replace existing CORS headers**
4. If prompted about method responses, click **Yes, replace existing values**

### Step 5: Deploy the API
1. Click **Actions** → **Deploy API**
2. Select **Deployment stage**: `prod` (or the stage that matches your endpoint)
3. **Deployment description**: "Add /upload route for file uploads"
4. Click **Deploy**

### Step 6: Verify Configuration
1. After deployment, go back to **Resources**
2. Click on the `/upload` resource
3. Click on the **POST** method
4. Verify:
   - Integration type is **Lambda Function**
   - **Use Lambda Proxy integration** is enabled
   - Lambda function is correctly selected
5. Test the endpoint:
   - Click the **TEST** button (or use the test icon)
   - **Method**: POST
   - **Request Body**: 
     ```json
     {
       "filename": "test.jpg",
       "contentType": "image/jpeg",
       "fileSize": 1000
     }
     ```
   - **Headers**: 
     - Key: `Authorization`
     - Value: `Bearer YOUR_JWT_TOKEN` (you may need to get this from the browser's localStorage if logged in)
   - Click **Test**
   - Should return a JSON response with `uploadUrl`, `url`, `key`, and `expiresIn` fields
   - If you get 401, that's expected - it means the route is working but needs authentication
   - If you get 404, the route isn't configured correctly

### Step 7: Report Back
Please tell me:
1. ✅ Successfully created `/upload` resource
2. ✅ Successfully created POST method
3. ✅ Lambda function connected: [function name]
4. ✅ CORS configured
5. ✅ API deployed to `prod` stage
6. Test result: [what happened when you tested]

### If You Encounter Issues:

**Can't find the API:**
- Look in the API Gateway list for APIs
- Check if there are multiple regions - the endpoint suggests `us-east-1`
- The API might be in a different account or region

**Can't find the Lambda function:**
- Go to Lambda service and list functions
- Look for functions that might be connected to API Gateway
- Check the function's configuration/triggers to see if it's already connected to API Gateway

**Permission errors:**
- Make sure you have permissions to modify API Gateway and Lambda
- The Lambda function needs to allow API Gateway to invoke it

**Route already exists:**
- If `/upload` already exists, check if it's configured correctly
- Verify the POST method is set up with Lambda Proxy integration

---

## Alternative: If Using Proxy Route

If you find that there's already a `/{proxy+}` route configured:
1. Check if it's connected to the Lambda function
2. Verify it has POST method (or ANY method)
3. Verify Lambda Proxy integration is enabled
4. If everything looks good, just report that the proxy route exists and should work
5. The Lambda code should handle `/upload` requests through the proxy

---

Please proceed with these steps and let me know what you find and any issues you encounter!
