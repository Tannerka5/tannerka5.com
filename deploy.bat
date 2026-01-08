@echo off
echo 🏗️  Building site...
call npm run build

echo 📦 Uploading static assets to S3...
aws s3 sync dist/ s3://tannerka5.com --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html" --exclude "sitemap.xml" --exclude "robots.txt"

echo 📦 Uploading HTML files to S3...
aws s3 sync dist/ s3://tannerka5.com --cache-control "public, max-age=0, must-revalidate" --exclude "*" --include "*.html" --include "sitemap.xml" --include "robots.txt"

echo 🔄 Invalidating CloudFront cache...
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"

echo ✅ Deployment complete!
echo 🌐 Changes will be live in 5-10 minutes
