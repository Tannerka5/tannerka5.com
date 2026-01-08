#!/bin/bash

echo "🏗️  Building site..."
npm run build

echo "📦 Uploading static assets to S3..."
aws s3 sync dist/ s3://tannerka5-portfolio-bucket --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html" --exclude "sitemap.xml" --exclude "robots.txt"

echo "📦 Uploading HTML files to S3..."
aws s3 sync dist/ s3://tannerka5-portfolio-bucket --cache-control "public, max-age=0, must-revalidate" --exclude "*" --include "*.html" --include "sitemap.xml" --include "robots.txt"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E59XP7AY1QZB2 --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Changes will be live in 5-10 minutes at https://tannerka5.com"
