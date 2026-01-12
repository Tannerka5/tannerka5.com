# Portfolio Backend API

Serverless backend for portfolio website built with TypeScript, AWS Lambda, API Gateway, and DynamoDB.

## Features

- Authentication with JWT tokens
- Full CRUD operations for Projects and Blog Posts
- Drag-and-drop reordering support
- RESTful API design

## Tech Stack

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Database**: DynamoDB (on-demand)
- **API**: API Gateway REST API
- **Authentication**: JWT tokens

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in AWS Lambda:
   - `PROJECTS_TABLE`: DynamoDB table name for projects (default: `portfolio-projects`)
   - `BLOG_POSTS_TABLE`: DynamoDB table name for blog posts (default: `portfolio-blog-posts`)
   - `USERS_TABLE`: DynamoDB table name for users (default: `portfolio-users`)
   - `JWT_SECRET`: Secret key for signing JWT tokens (REQUIRED - use a strong random string)
   - `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password (generate with `bcrypt.hashSync('your-password', 10)`)
   - `ALLOWED_ORIGIN`: CORS allowed origin (default: `*`)

3. Create DynamoDB tables:
   - Create tables with partition key `id` (String)
   - Add Global Secondary Index (GSI) named `slug-index` with partition key `slug` (String) for both tables

4. Generate admin password hash:
   ```javascript
   const bcrypt = require('bcryptjs');
   console.log(bcrypt.hashSync('your-secure-password', 10));
   ```

5. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## API Endpoints

### Authentication

- `POST /auth/login` - Login (public)
  - Body: `{ username: string, password: string }`
  - Returns: `{ token: string, user: object }`

### Projects (Protected - requires Bearer token)

- `GET /projects` - Get all projects
- `GET /projects/{slug}` - Get single project
- `POST /projects` - Create new project
- `PUT /projects/{slug}` - Update project
- `DELETE /projects/{slug}` - Delete project
- `POST /projects/reorder` - Reorder projects
  - Body: `{ items: [{ id: string, order: number }] }`

### Blog Posts (Protected - requires Bearer token)

- `GET /blog-posts` - Get all blog posts
- `GET /blog-posts/{slug}` - Get single blog post
- `POST /blog-posts` - Create new blog post
- `PUT /blog-posts/{slug}` - Update blog post
- `DELETE /blog-posts/{slug}` - Delete blog post
- `POST /blog-posts/reorder` - Reorder blog posts
  - Body: `{ items: [{ id: string, order: number }] }`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Tokens expire after 24 hours.

## DynamoDB Schema

### Projects Table
- Partition Key: `id` (String)
- GSI: `slug-index` with `slug` as partition key
- Fields: All fields from the Project interface

### Blog Posts Table
- Partition Key: `id` (String)
- GSI: `slug-index` with `slug` as partition key
- Fields: All fields from the BlogPost interface

### Users Table
- Partition Key: `id` (String)
- GSI: `username-index` with `username` as partition key (String)
- Fields:
  - `id` (String): Unique user ID
  - `username` (String): Username (must be unique)
  - `passwordHash` (String): Bcrypt hashed password
  - `role` (String): User role (e.g., 'admin')
  - `createdAt` (Number): Timestamp when user was created
- **Note**: If users table doesn't exist or fails, the system falls back to `ADMIN_PASSWORD_HASH` environment variable for the 'admin' user

### Users Table
- Partition Key: `id` (String)
- GSI: `username-index` with `username` as partition key (String)
- Fields:
  - `id` (String): Unique user ID
  - `username` (String): Username (must be unique)
  - `passwordHash` (String): Bcrypt hashed password
  - `role` (String): User role (e.g., 'admin')
  - `createdAt` (Number): Timestamp when user was created
- **Note**: If users table doesn't exist or fails, the system falls back to `ADMIN_PASSWORD_HASH` environment variable for the 'admin' user

## Development

- Install dependencies: `npm install`
- Compile TypeScript: `npm run build`
- Watch for changes: `npm run watch`
- Package for Lambda: `npm run deploy`

## Deployment

1. Run `npm run deploy` to create `lambda.zip`
2. Upload `lambda.zip` to AWS Lambda
3. Set environment variables in Lambda configuration
4. Connect API Gateway to Lambda function
5. Enable CORS in API Gateway (or use the CORS headers in code)
6. Set up DynamoDB tables with proper indexes