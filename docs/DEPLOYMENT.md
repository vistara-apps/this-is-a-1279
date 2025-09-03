# Deployment Guide for Solana Vote Tester

This document provides instructions for deploying the Solana Vote Tester application to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Deployment Options](#deployment-options)
  - [GitHub Pages](#github-pages)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedure](#rollback-procedure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

## Building for Production

To build the application for production, run:

```bash
# Install dependencies
npm install
# or
yarn

# Build for production
npm run build
# or
yarn build
```

This will create a `dist` directory with the production-ready files.

## Deployment Options

### GitHub Pages

1. Update the `vite.config.js` file to include the base path:

```javascript
export default defineConfig({
  base: '/this-is-a-1279/',
  // other config options...
})
```

2. Build the application:

```bash
npm run build
# or
yarn build
```

3. Deploy using the GitHub Actions workflow:

The repository already includes a GitHub Actions workflow for deploying to GitHub Pages. It's located at `.github/workflows/deploy.yml`.

To manually deploy to GitHub Pages:

```bash
# Install gh-pages if not already installed
npm install -g gh-pages

# Deploy the dist directory
gh-pages -d dist
```

### Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
# or
yarn global add vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. For production deployment:

```bash
vercel --prod
```

The repository already includes a Vercel configuration at `.github/workflows/vercel-deploy.yml`.

### Netlify

1. Install the Netlify CLI:

```bash
npm install -g netlify-cli
# or
yarn global add netlify-cli
```

2. Build the application:

```bash
npm run build
# or
yarn build
```

3. Deploy to Netlify:

```bash
netlify deploy
```

4. For production deployment:

```bash
netlify deploy --prod
```

Alternatively, you can connect your GitHub repository to Netlify for automatic deployments.

### AWS S3 + CloudFront

1. Build the application:

```bash
npm run build
# or
yarn build
```

2. Deploy to S3:

```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

3. Invalidate CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Docker

The repository includes a Dockerfile for containerized deployment.

1. Build the Docker image:

```bash
docker build -t solana-vote-tester .
```

2. Run the Docker container:

```bash
docker run -p 8080:80 solana-vote-tester
```

## Environment Variables

The application doesn't require any environment variables for basic functionality. However, you can customize the following:

- `VITE_APP_TITLE`: Custom application title
- `VITE_APP_DESCRIPTION`: Custom application description

Create a `.env` file in the root directory to set these variables:

```
VITE_APP_TITLE=Solana Vote Tester
VITE_APP_DESCRIPTION=Free Solana vote testing for developers
```

## Continuous Integration/Continuous Deployment (CI/CD)

The repository includes GitHub Actions workflows for CI/CD:

- `.github/workflows/deploy.yml`: Deploys to GitHub Pages
- `.github/workflows/vercel-deploy.yml`: Deploys to Vercel

These workflows are triggered on pushes to the main branch.

## Post-Deployment Verification

After deploying, verify that:

1. The application loads correctly
2. All features work as expected
3. The UI is responsive on different devices
4. There are no console errors

## Rollback Procedure

### GitHub Pages

1. Find the previous deployment in the GitHub Actions workflow runs
2. Re-run the workflow for the previous commit

### Vercel

1. Go to the Vercel dashboard
2. Find the project
3. Go to the "Deployments" tab
4. Click on the previous deployment
5. Click "Promote to Production"

### Netlify

1. Go to the Netlify dashboard
2. Find the project
3. Go to the "Deploys" tab
4. Click on the previous deployment
5. Click "Publish deploy"

### AWS S3 + CloudFront

1. Deploy the previous version to S3:

```bash
aws s3 sync previous-dist/ s3://your-bucket-name/ --delete
```

2. Invalidate CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Docker

1. Run the previous Docker image:

```bash
docker run -p 8080:80 solana-vote-tester:previous-tag
```

## Troubleshooting

### Common Issues

1. **White screen after deployment**
   - Check for JavaScript errors in the browser console
   - Verify that the base path is correctly set in `vite.config.js`
   - Ensure all assets are being loaded correctly

2. **Styling issues**
   - Verify that the CSS is being loaded correctly
   - Check for responsive design issues on different devices

3. **404 errors for assets**
   - Check the network tab in the browser developer tools
   - Verify that the paths to assets are correct
   - Ensure the base path is correctly set

4. **Application not updating after deployment**
   - Clear browser cache
   - Verify that the cache invalidation was successful
   - Check for caching headers in the server response

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the [GitHub Issues](https://github.com/vistara-apps/this-is-a-1279/issues) for similar problems
2. Create a new issue with detailed information about the problem
3. Reach out to the maintainers for assistance

