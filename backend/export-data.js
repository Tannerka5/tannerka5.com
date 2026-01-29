/**
 * Export script to pull data from DynamoDB and save to local TypeScript files
 * 
 * This is the reverse of migrate-data.js - it pulls data FROM DynamoDB TO local files
 * 
 * Prerequisites:
 *   1. Configure AWS credentials (via AWS CLI or environment variables)
 *   2. Set table names if different from defaults (PROJECTS_TABLE, BLOG_POSTS_TABLE)
 *   3. Set AWS region if tables are in a different region (AWS_REGION)
 * 
 * Usage:
 *   node export-data.js
 * 
 * With custom region:
 *   AWS_REGION=us-east-2 node export-data.js
 * 
 * With custom table names:
 *   PROJECTS_TABLE=my-projects BLOG_POSTS_TABLE=my-blog-posts node export-data.js
 * 
 * Export only projects:
 *   node export-data.js --projects-only
 * 
 * Export only blog posts:
 *   node export-data.js --blog-only
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
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

// Command line arguments
const args = process.argv.slice(2);
const projectsOnly = args.includes('--projects-only');
const blogOnly = args.includes('--blog-only');

/**
 * Format a JavaScript object as TypeScript code
 */
function formatAsTypeScript(data, indent = 2) {
  if (data === null || data === undefined) {
    return 'null';
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    const items = data.map(item => {
      const formatted = formatAsTypeScript(item, indent + 2);
      return ' '.repeat(indent) + formatted;
    });
    return '[\n' + items.join(',\n') + '\n' + ' '.repeat(indent - 2) + ']';
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}';
    const items = keys.map(key => {
      const value = formatAsTypeScript(data[key], indent + 2);
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return ' '.repeat(indent) + `${keyStr}: ${value}`;
    });
    return '{\n' + items.join(',\n') + '\n' + ' '.repeat(indent - 2) + '}';
  }
  
  if (typeof data === 'string') {
    // Escape special characters and wrap in quotes
    return JSON.stringify(data);
  }
  
  return String(data);
}

/**
 * Export projects from DynamoDB to TypeScript file
 */
async function exportProjects() {
  console.log('📦 Exporting projects from DynamoDB...');
  
  try {
    // Scan all projects from DynamoDB
    const result = await docClient.send(new ScanCommand({
      TableName: PROJECTS_TABLE
    }));
    
    if (!result.Items || result.Items.length === 0) {
      console.log('   ⚠️  No projects found in DynamoDB');
      return;
    }
    
    const projects = result.Items;
    console.log(`   Found ${projects.length} projects`);
    
    // Sort by order if available, otherwise by slug
    projects.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return (a.slug || '').localeCompare(b.slug || '');
    });
    
    // Read the existing file to preserve the interface definition
    const projectsFilePath = path.join(__dirname, '../frontend-new/data/projects.ts');
    let interfaceDefinition = '';
    
    if (fs.existsSync(projectsFilePath)) {
      const existingContent = fs.readFileSync(projectsFilePath, 'utf-8');
      // Extract the interface definition (everything before "export const projects")
      const interfaceMatch = existingContent.match(/^([\s\S]*?)(export const projects)/);
      if (interfaceMatch) {
        interfaceDefinition = interfaceMatch[1].trim();
        
        // Ensure the interface includes DynamoDB metadata fields
        // Add id, createdAt, updatedAt, and order if they're missing
        const needsId = !interfaceDefinition.match(/\bid\??\s*:/);
        const needsOrder = !interfaceDefinition.match(/\border\??\s*:/);
        const needsCreatedAt = !interfaceDefinition.match(/\bcreatedAt\??\s*:/);
        const needsUpdatedAt = !interfaceDefinition.match(/\bupdatedAt\??\s*:/);
        
        if (needsId || needsOrder || needsCreatedAt || needsUpdatedAt) {
          // Find the closing brace of the interface and add fields before it
          const lastBraceIndex = interfaceDefinition.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            const beforeBrace = interfaceDefinition.substring(0, lastBraceIndex).trim();
            const afterBrace = interfaceDefinition.substring(lastBraceIndex);
            
            // Build the fields to add
            const fieldsToAdd = [];
            if (needsId) fieldsToAdd.push('  id?: string;');
            if (needsOrder) fieldsToAdd.push('  order?: number;');
            if (needsCreatedAt) fieldsToAdd.push('  createdAt?: number;');
            if (needsUpdatedAt) fieldsToAdd.push('  updatedAt?: number;');
            
            if (fieldsToAdd.length > 0) {
              interfaceDefinition = beforeBrace + 
                (beforeBrace.endsWith(';') || beforeBrace.endsWith('}') ? '' : '') +
                '\n' + fieldsToAdd.join('\n') +
                afterBrace;
            }
          }
        }
      }
    }
    
    // If no interface found, use a default one
    if (!interfaceDefinition) {
      interfaceDefinition = `export interface Project {
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  role?: string;
  timeline?: string;
  techStack: string[];
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  logo?: string;
  icon?: string;
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  detailed?: {
    overview?: string;
    problem?: string;
    solution?: string;
    challenges?: Array<{
      title?: string;
      description?: string;
      solution?: string;
    }>;
    learnings?: string[];
    features?: string[];
    media?: Array<{
      type?: string;
      url?: string;
      caption?: string;
      thumbnail?: string;
    }>;
    metrics?: Array<{
      label?: string;
      value?: string;
    }>;
  };
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}`;
    }
    
    // Format projects as TypeScript array
    const projectsArray = formatAsTypeScript(projects, 2);
    
    // Write to file
    const fileContent = `${interfaceDefinition}\n\nexport const projects: Project[] = ${projectsArray};\n`;
    
    // Ensure directory exists
    const dir = path.dirname(projectsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(projectsFilePath, fileContent, 'utf-8');
    console.log(`   ✅ Exported ${projects.length} projects to ${projectsFilePath}`);
    
  } catch (error) {
    if (error.name === 'ResourceNotFoundException' || 
        error.__type?.includes('ResourceNotFoundException')) {
      console.error(`   ❌ Table "${PROJECTS_TABLE}" does not exist`);
      return;
    }
    throw error;
  }
}

/**
 * Export blog posts from DynamoDB to TypeScript file
 */
async function exportBlogPosts() {
  console.log('📝 Exporting blog posts from DynamoDB...');
  
  try {
    // Scan all blog posts from DynamoDB
    const result = await docClient.send(new ScanCommand({
      TableName: BLOG_POSTS_TABLE
    }));
    
    if (!result.Items || result.Items.length === 0) {
      console.log('   ⚠️  No blog posts found in DynamoDB');
      return;
    }
    
    const posts = result.Items;
    console.log(`   Found ${posts.length} blog posts`);
    
    // Sort by order if available, otherwise by date
    posts.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return (a.slug || '').localeCompare(b.slug || '');
    });
    
    // Read the existing file to preserve the interface definition
    const blogPostsFilePath = path.join(__dirname, '../frontend-new/data/blog-posts.ts');
    let interfaceDefinition = '';
    
    if (fs.existsSync(blogPostsFilePath)) {
      const existingContent = fs.readFileSync(blogPostsFilePath, 'utf-8');
      // Extract the interface definition (everything before "export const blogPosts")
      const interfaceMatch = existingContent.match(/^([\s\S]*?)(export const blogPosts)/);
      if (interfaceMatch) {
        interfaceDefinition = interfaceMatch[1].trim();
        
        // Ensure the interface includes DynamoDB metadata fields
        // Add id, createdAt, updatedAt, and order if they're missing
        const needsId = !interfaceDefinition.match(/\bid\??\s*:/);
        const needsOrder = !interfaceDefinition.match(/\border\??\s*:/);
        const needsCreatedAt = !interfaceDefinition.match(/\bcreatedAt\??\s*:/);
        const needsUpdatedAt = !interfaceDefinition.match(/\bupdatedAt\??\s*:/);
        
        if (needsId || needsOrder || needsCreatedAt || needsUpdatedAt) {
          // Find the closing brace of the interface and add fields before it
          const lastBraceIndex = interfaceDefinition.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            const beforeBrace = interfaceDefinition.substring(0, lastBraceIndex).trim();
            const afterBrace = interfaceDefinition.substring(lastBraceIndex);
            
            // Build the fields to add
            const fieldsToAdd = [];
            if (needsId) fieldsToAdd.push('  id?: string;');
            if (needsOrder) fieldsToAdd.push('  order?: number;');
            if (needsCreatedAt) fieldsToAdd.push('  createdAt?: number;');
            if (needsUpdatedAt) fieldsToAdd.push('  updatedAt?: number;');
            
            if (fieldsToAdd.length > 0) {
              interfaceDefinition = beforeBrace + 
                (beforeBrace.endsWith(';') || beforeBrace.endsWith('}') ? '' : '') +
                '\n' + fieldsToAdd.join('\n') +
                afterBrace;
            }
          }
        }
      }
    }
    
    // If no interface found, use a default one
    if (!interfaceDefinition) {
      interfaceDefinition = `export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  date: string;
  author?: string;
  tags?: string[];
  published?: boolean;
  order?: number;
  createdAt?: number;
  updatedAt?: number;
}`;
    }
    
    // Format posts as TypeScript array
    const postsArray = formatAsTypeScript(posts, 2);
    
    // Write to file
    const fileContent = `${interfaceDefinition}\n\nexport const blogPosts: BlogPost[] = ${postsArray};\n`;
    
    // Ensure directory exists
    const dir = path.dirname(blogPostsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(blogPostsFilePath, fileContent, 'utf-8');
    console.log(`   ✅ Exported ${posts.length} blog posts to ${blogPostsFilePath}`);
    
  } catch (error) {
    if (error.name === 'ResourceNotFoundException' || 
        error.__type?.includes('ResourceNotFoundException')) {
      console.error(`   ❌ Table "${BLOG_POSTS_TABLE}" does not exist`);
      return;
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting data export from DynamoDB...\n');
  console.log(`   AWS Region: ${AWS_REGION}`);
  console.log(`   Projects table: ${PROJECTS_TABLE}`);
  console.log(`   Blog posts table: ${BLOG_POSTS_TABLE}\n`);
  
  // Check AWS credentials
  if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION && !process.env.AWS_PROFILE) {
    console.warn('⚠️  Warning: AWS region not explicitly set. Using default: ' + AWS_REGION);
    console.warn('   If your tables are in a different region, set AWS_REGION environment variable.\n');
  }
  
  try {
    if (!blogOnly) {
      await exportProjects();
      console.log('');
    }
    
    if (!projectsOnly) {
      await exportBlogPosts();
    }
    
    console.log('\n🎉 Export complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the exported files in frontend-new/data/');
    console.log('   2. Commit the changes to git if desired');
    console.log('   3. The exported data can be used for local development or backup');
    
  } catch (error) {
    console.error('\n💥 Export failed!');
    console.error('\nError details:', error.message || error);
    
    if (error.message?.includes('credentials')) {
      console.error('\n💡 Make sure AWS credentials are configured:');
      console.error('   - Run: aws configure');
      console.error('   - Or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables');
    }
    
    process.exit(1);
  }
}

// Run export
if (require.main === module) {
  main();
}
