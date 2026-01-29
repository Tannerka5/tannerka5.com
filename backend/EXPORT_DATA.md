# Exporting Data from DynamoDB to Local Files

This guide explains how to pull data from DynamoDB (that was edited through the admin interface) back to your local machine.

## Overview

The admin interface edits data stored in **DynamoDB** (projects and blog posts), not code files. To sync this data to your local machine, use the `export-data.js` script.

## Prerequisites

1. **AWS Credentials Configured**
   - Run `aws configure` to set up your credentials
   - Or set environment variables: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

2. **Node.js Dependencies**
   ```bash
   cd backend
   npm install
   ```

## Usage

### Export All Data (Projects + Blog Posts)

```bash
cd backend
npm run export
```

Or directly:
```bash
node export-data.js
```

### Export Only Projects

```bash
npm run export:projects
```

Or:
```bash
node export-data.js --projects-only
```

### Export Only Blog Posts

```bash
npm run export:blog
```

Or:
```bash
node export-data.js --blog-only
```

## Custom Configuration

### Custom AWS Region

```bash
AWS_REGION=us-east-1 npm run export
```

### Custom Table Names

```bash
PROJECTS_TABLE=my-projects BLOG_POSTS_TABLE=my-blog-posts npm run export
```

### Both Custom Region and Table Names

```bash
AWS_REGION=us-east-1 PROJECTS_TABLE=my-projects BLOG_POSTS_TABLE=my-blog-posts npm run export
```

## Output Files

The script exports data to TypeScript files:

- **Projects**: `frontend-new/data/projects.ts`
- **Blog Posts**: `frontend-new/data/blog-posts.ts`

These files preserve the existing TypeScript interface definitions and update only the data arrays.

## What Gets Exported

- All fields from DynamoDB items
- Projects sorted by `order` field (if available), otherwise by `slug`
- Blog posts sorted by `order` field (if available), otherwise by `date`

## Example Workflow

1. **Edit a project** through the admin interface at `https://tannerka5.com/admin`
2. **Export the data** to your local machine:
   ```bash
   cd backend
   npm run export
   ```
3. **Review the changes** in `frontend-new/data/projects.ts`
4. **Commit to git** (optional):
   ```bash
   git add frontend-new/data/projects.ts
   git commit -m "Sync project data from DynamoDB"
   git push
   ```

## Troubleshooting

### "Table does not exist" Error

Make sure:
- The table names are correct (default: `portfolio-projects`, `portfolio-blog-posts`)
- You're using the correct AWS region
- Your AWS credentials have permission to read from DynamoDB

### "Credentials not found" Error

Configure AWS credentials:
```bash
aws configure
```

Or set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-2
```

### Data Not Updating

- Check that you're using the correct table names
- Verify your AWS credentials have read permissions
- Make sure the tables exist in the specified region

## Notes

- The export script **preserves** existing TypeScript interface definitions
- It **overwrites** the data arrays with fresh data from DynamoDB
- The exported files can be used for:
  - Local development
  - Version control / backup
  - Testing with static data
  - Migration to other systems

## Related Scripts

- **Import/Migrate**: `migrate-data.js` - Pushes data FROM local files TO DynamoDB
- **Export**: `export-data.js` - Pulls data FROM DynamoDB TO local files
