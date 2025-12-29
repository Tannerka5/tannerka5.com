# Portfolio Backend API

Serverless backend for portfolio website built with TypeScript, AWS Lambda, API Gateway, and DynamoDB.

## Tech Stack

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Database**: DynamoDB (on-demand)
- **API**: API Gateway REST API
- **Authentication**: API Key (x-api-key header)

## API Endpoints

### Public Endpoints

- `GET /projects` - Get all projects

### Protected Endpoints (require x-api-key header)

- `POST /projects` - Create a new project
- `PUT /projects/{id}` - Update a project
- `DELETE /projects/{id}` - Delete a project

## Development

- Install dependencies
  npm install
- Compile TypeScript
  npm run build
- Watch for changes
  npm run watch
- Package for Lambda
  npm run deploy

## Deployment

1. Run `npm run deploy` to create `lambda.zip`
2. Upload `lambda.zip` to AWS Lambda
3. Set environment variables:
   - `TABLE_NAME`: DynamoDB table name
   - `API_KEY`: Secret key for protected endpoints
4. Connect API Gateway to Lambda function
5. Enable CORS in API Gateway

## Environment Variables

- `TABLE_NAME`: DynamoDB table name (e.g., `portfolio-projects`)
- `API_KEY`: Secret key for authentication

## Project Structure

backend/
├── src/
│ └── handler.ts # Main Lambda function
├── dist/ # Compiled JavaScript (gitignored)
├── node_modules/ # Dependencies (gitignored)
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── lambda.zip # Deployment package (gitignored)
