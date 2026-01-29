/**
 * Migration script to migrate projects and blog posts from TypeScript files to DynamoDB
 * 
 * Prerequisites:
 *   1. Configure AWS credentials (via AWS CLI or environment variables)
 *   2. Set table names if different from defaults (PROJECTS_TABLE, BLOG_POSTS_TABLE)
 *   3. Set AWS region if tables are in a different region (AWS_REGION)
 * 
 * Usage:
 *   node migrate-data.js
 * 
 * With custom region:
 *   AWS_REGION=us-east-2 node migrate-data.js
 * 
 * With custom table names:
 *   PROJECTS_TABLE=my-projects BLOG_POSTS_TABLE=my-blog-posts node migrate-data.js
 * 
 * With both:
 *   AWS_REGION=us-east-2 PROJECTS_TABLE=my-projects BLOG_POSTS_TABLE=my-blog-posts node migrate-data.js
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Table names (can be overridden with environment variables)
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || 'portfolio-projects';
const BLOG_POSTS_TABLE = process.env.BLOG_POSTS_TABLE || 'portfolio-blog-posts';

// AWS Region (can be overridden with environment variable)
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-2';

// Initialize DynamoDB client with region
const client = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Parse TypeScript file and extract the exported array
 * This is a simple parser - works for basic TypeScript exports
 */
function parseTypeScriptArray(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Remove TypeScript type annotations and interface definitions
  // Find the export const array = [...] part
  const exportMatch = content.match(/export const \w+: .*? = (\[[\s\S]*\]);/);
  if (!exportMatch) {
    throw new Error(`Could not find exported array in ${filePath}`);
  }
  
  // Extract the array content
  let arrayContent = exportMatch[1];
  
  // Remove trailing semicolon if present
  arrayContent = arrayContent.replace(/;\s*$/, '');
  
  // Use Function constructor to safely evaluate the array
  // This is safer than eval because it creates a new scope
  try {
    // eslint-disable-next-line no-new-func
    const array = new Function('return ' + arrayContent)();
    return array;
  } catch (error) {
    console.error('Error parsing array:', error);
    console.error('Array content (first 500 chars):', arrayContent.substring(0, 500));
    throw error;
  }
}

async function migrateProjects() {
  console.log('📦 Migrating projects...');
  
  try {
    // Check if table has existing items
    let existing;
    try {
      existing = await docClient.send(new ScanCommand({
        TableName: PROJECTS_TABLE,
        Limit: 1
      }));
    } catch (scanError) {
      // Check if table doesn't exist
      if (scanError.name === 'ResourceNotFoundException' || 
          scanError.__type?.includes('ResourceNotFoundException')) {
        throw new Error(`Table "${PROJECTS_TABLE}" does not exist. Please create it first. See LAMBDA_SETUP_GUIDE.md for instructions.`);
      }
      throw scanError;
    }
    
    if (existing.Items && existing.Items.length > 0) {
      const countResult = await docClient.send(new ScanCommand({
        TableName: PROJECTS_TABLE,
        Select: 'COUNT'
      }));
      console.log(`⚠️  Warning: Table ${PROJECTS_TABLE} already has ${countResult.Count || 0} items.`);
      console.log('   This script will add new items. Items with duplicate slugs will overwrite existing ones.');
      
      const confirm = process.argv.includes('--force');
      if (!confirm) {
        console.log('   Use --force flag to proceed anyway.');
        console.log('   Exiting...');
        return;
      }
      console.log('   Proceeding with --force flag...\n');
    }
    
    // Import projects data
    const projectsPath = path.join(__dirname, '../frontend-new/data/projects.ts');
    const projects = parseTypeScriptArray(projectsPath);
    console.log(`   Found ${projects.length} projects to migrate`);
    
    // Transform and upload each project
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      const projectItem = {
        id: uuidv4(),
        slug: project.slug,
        ...project,
        order: i, // Preserve original order
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await docClient.send(new PutCommand({
        TableName: PROJECTS_TABLE,
        Item: projectItem
      }));
      
      console.log(`   ✓ Migrated: ${project.slug} (${project.title.substring(0, 40)}...)`);
    }
    
    console.log(`✅ Successfully migrated ${projects.length} projects to ${PROJECTS_TABLE}`);
  } catch (error) {
    console.error('❌ Error migrating projects:', error);
    throw error;
  }
}

async function migrateBlogPosts() {
  console.log('📝 Migrating blog posts...');
  
  try {
    // Check if table has existing items
    let existing;
    try {
      existing = await docClient.send(new ScanCommand({
        TableName: BLOG_POSTS_TABLE,
        Limit: 1
      }));
    } catch (scanError) {
      // Check if table doesn't exist
      if (scanError.name === 'ResourceNotFoundException' || 
          scanError.__type?.includes('ResourceNotFoundException')) {
        throw new Error(`Table "${BLOG_POSTS_TABLE}" does not exist. Please create it first. See LAMBDA_SETUP_GUIDE.md for instructions.`);
      }
      throw scanError;
    }
    
    if (existing.Items && existing.Items.length > 0) {
      const countResult = await docClient.send(new ScanCommand({
        TableName: BLOG_POSTS_TABLE,
        Select: 'COUNT'
      }));
      console.log(`⚠️  Warning: Table ${BLOG_POSTS_TABLE} already has ${countResult.Count || 0} items.`);
      console.log('   This script will add new items. Items with duplicate slugs will overwrite existing ones.');
      
      const confirm = process.argv.includes('--force');
      if (!confirm) {
        console.log('   Use --force flag to proceed anyway.');
        console.log('   Exiting...');
        return;
      }
      console.log('   Proceeding with --force flag...\n');
    }
    
    // Import blog posts data
    const blogPostsPath = path.join(__dirname, '../frontend-new/data/blog-posts.ts');
    const blogPosts = parseTypeScriptArray(blogPostsPath);
    console.log(`   Found ${blogPosts.length} blog posts to migrate`);
    
    // Transform and upload each blog post
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      
      const postItem = {
        id: uuidv4(),
        slug: post.slug,
        ...post,
        order: i, // Preserve original order
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await docClient.send(new PutCommand({
        TableName: BLOG_POSTS_TABLE,
        Item: postItem
      }));
      
      console.log(`   ✓ Migrated: ${post.slug} (${post.title.substring(0, 40)}...)`);
    }
    
    console.log(`✅ Successfully migrated ${blogPosts.length} blog posts to ${BLOG_POSTS_TABLE}`);
  } catch (error) {
    console.error('❌ Error migrating blog posts:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting data migration...\n');
  console.log(`   AWS Region: ${AWS_REGION}`);
  console.log(`   Projects table: ${PROJECTS_TABLE}`);
  console.log(`   Blog posts table: ${BLOG_POSTS_TABLE}\n`);
  
  // Check AWS credentials
  if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION && !process.env.AWS_PROFILE) {
    console.warn('⚠️  Warning: AWS region not explicitly set. Using default: ' + AWS_REGION);
    console.warn('   If your tables are in a different region, set AWS_REGION environment variable.\n');
  }
  
  try {
    await migrateProjects();
    console.log('');
    await migrateBlogPosts();
    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('\n💥 Migration failed!');
    
    // Check for table not found errors
    if (error.name === 'ResourceNotFoundException' || 
        error.__type?.includes('ResourceNotFoundException') ||
        error.message?.includes('does not exist')) {
      console.error('\n❌ DynamoDB tables not found!');
      console.error('\n💡 You need to create the following tables first:');
      console.error(`   - ${PROJECTS_TABLE}`);
      console.error(`   - ${BLOG_POSTS_TABLE}`);
      console.error('\n📖 See LAMBDA_SETUP_GUIDE.md for detailed table creation instructions.');
      console.error('\n   Quick steps:');
      console.error('   1. Go to AWS Console → DynamoDB');
      console.error('   2. Create tables with the names above');
      console.error('   3. Add a GSI named "slug-index" on the "slug" attribute');
      console.error('   4. Run this script again');
    } else {
      console.error('\nError details:', error.message || error);
    }
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  main();
}
