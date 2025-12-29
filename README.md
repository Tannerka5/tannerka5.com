# Cloud Portfolio Website

A scalable, cloud-hosted portfolio website built on AWS demonstrating infrastructure as code, cost optimization, and modern web development practices.

## Live Site

[tannerka5.com](https://tannerka5.com)

## Architecture

- **Frontend**: HTML, CSS (Tailwind CDN), Vanilla JavaScript
- **Hosting**: AWS S3 (static site hosting)
- **CDN**: AWS CloudFront
- **DNS**: Cloudflare
- **SSL/TLS**: AWS Certificate Manager (ACM)
- **Deployment**: Manual upload to S3

## Project Structure

portfolio-site/
├── index.html # Home page
├── about.html # About page
├── projects.html # Projects showcase
├── contact.html # Contact page
├── images/ # Images and logos
│ ├── profile.jpg
│ ├── ellarises-logo.png
│ └── neighboraid-logo.png
└── README.md

## Features

- Fully responsive design using Tailwind CSS
- Custom domain with HTTPS
- Role-based project showcase (full-stack, cloud infrastructure)
- Contact form integration with Formspree
- Mobile-friendly navigation

## Cost Optimization

Monthly AWS costs kept under $3 by:

- Using S3 + CloudFront instead of EC2/Elastic Beanstalk
- Cloudflare DNS (free) instead of Route 53 hosted zone
- Static site architecture (no always-on compute)

## Deployment

1. Build/update HTML files locally
2. Upload to S3 bucket: `tannerka5-portfolio-bucket`
3. CloudFront automatically distributes changes globally
4. Typical propagation time: 5-15 minutes

## Development

### Frontend

- cd frontend
- Edit HTML files directly
- Upload to S3 when ready

### Backend

- cd backend
- npm install
- npm run build # Compile TypeScript
- npm run deploy # Package for Lambda deployment

## Author

**Tanner Atkinson**  
Information Systems Student @ BYU Marriott  
[LinkedIn](https://linkedin.com/in/tanneratkinson) | [GitHub](https://github.com/Tannerka5)
