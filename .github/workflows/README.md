# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for automated deployment to test and production environments.

## Quick Setup Checklist

Before using these workflows, ensure you have configured all required GitHub secrets (10 total):

**Development Environment:**
- ✅ `FIREBASE_PROJECT_ID_DEV`
- ✅ `FIREBASE_TOKEN_DEV`
- ✅ `FIREBASE_SERVICE_ACCOUNT_DEV`
- ✅ `DEV_FRONTEND_ENV`
- ✅ `DEV_FUNCTIONS_ENV`

**Production Environment:**
- ✅ `FIREBASE_PROJECT_ID_PROD`
- ✅ `FIREBASE_TOKEN_PROD`
- ✅ `FIREBASE_SERVICE_ACCOUNT_PROD`
- ✅ `PROD_FRONTEND_ENV`
- ✅ `PROD_FUNCTIONS_ENV`

See detailed setup instructions below.

## Workflows

### 1. Deploy to Development (`deploy-dev.yml`)

Automatically deploys to the development Firebase environment when changes are pushed to the `main` branch or when a pull request is merged. Also supports manual triggering.

**Triggers:**
- Push to `main` branch (automatic, change detection enabled)
- Pull request closed (merged) to `main` branch (automatic, change detection enabled)
- Manual trigger via GitHub Actions UI (skips change detection)

**Automatic Deployment Behavior:**
- Detects which parts of the codebase changed (frontend, functions, or both)
- Only deploys the components that have changed
- Runs frontend and functions deployments in parallel when both changed
- Skips deployment if no relevant changes detected

**Manual Deployment Behavior:**
- Manual triggers **bypass change detection** and always deploy **both** frontend and functions
- Useful for force redeployment or configuration changes without code changes

**Deployment Steps:**
- **Frontend**: Install dependencies → Create `.env` → Build → Deploy to Firebase Hosting (development project)
- **Functions**: Install dependencies → Create `.env` → Build → Deploy to Firebase Functions (development project)

### 2. Deploy to Production (`deploy-prod.yml`)

Manual deployment workflow for production environment. Requires explicit triggering through GitHub Actions UI.

**Triggers:**
- Manual trigger via GitHub Actions UI (`workflow_dispatch`)

**Options:**
When triggering the workflow, you can select what to deploy:
- `frontend` - Deploy only the frontend
- `functions` - Deploy only the functions
- `both` - Deploy both frontend and functions (default)

**Deployment Steps:**
- **Frontend**: Install dependencies → Create `.env` → Build → Deploy to Firebase Hosting (production project)
- **Functions**: Install dependencies → Create `.env` → Build → Deploy to Firebase Functions (production project)
- Uses GitHub environment protection rules for `production` environment (can require approvals)

## Required GitHub Secrets

Before the workflows can run, you need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Development Environment Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FIREBASE_PROJECT_ID_DEV` | Firebase project ID for development environment | Find in Firebase Console → Project Settings |
| `FIREBASE_TOKEN_DEV` | Firebase CI token for development project | Run `firebase login:ci` (see instructions below) |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | Service account JSON for development project | See instructions below |
| `DEV_FRONTEND_ENV` | Frontend environment variables for development | Create `.env` file content (see format below) |
| `DEV_FUNCTIONS_ENV` | Functions environment variables for development | Create `.env` file content (see format below) |

### Production Environment Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FIREBASE_PROJECT_ID_PROD` | Firebase project ID for production environment | Find in Firebase Console → Project Settings |
| `FIREBASE_TOKEN_PROD` | Firebase CI token for production project | Run `firebase login:ci` (see instructions below) |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | Service account JSON for production project | See instructions below |
| `PROD_FRONTEND_ENV` | Frontend environment variables for production | Create `.env` file content (see format below) |
| `PROD_FUNCTIONS_ENV` | Functions environment variables for production | Create `.env` file content (see format below) |

## Setting Up Firebase Authentication

### Getting Firebase CI Token

1. Install Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
```

2. Login and generate a CI token:
```bash
firebase login:ci
```

3. Follow the browser authentication flow
4. Copy the token that is displayed in the terminal
5. Add it to GitHub Secrets as `FIREBASE_TOKEN_TEST` and `FIREBASE_TOKEN_PROD`

### Setting Up Firebase Service Accounts

### Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (test or production)
3. Navigate to **IAM & Admin > Service Accounts**
4. Click **Create Service Account**
5. Name it something like `github-actions-deploy`
6. Click **Create and Continue**

### Step 2: Assign Roles

Assign the following roles to the service account:
- **Firebase Admin** (for full deployment access)
- **Cloud Functions Developer** (for functions deployment)
- **Firebase Hosting Admin** (for hosting deployment)

Alternatively, you can use:
- **Editor** role (broader permissions, simpler setup)

### Step 3: Generate JSON Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key > Create new key**
4. Select **JSON** format
5. Click **Create** - a JSON file will be downloaded

### Step 4: Add to GitHub Secrets

1. Open the downloaded JSON file in a text editor
2. Copy the **entire contents** of the file
3. Go to your GitHub repository
4. Navigate to **Settings > Secrets and variables > Actions**
5. Click **New repository secret**
6. Name: `FIREBASE_TEST_SERVICE_ACCOUNT` (or `FIREBASE_PROD_SERVICE_ACCOUNT`)
7. Value: Paste the entire JSON content
8. Click **Add secret**

### Step 5: Add Project IDs

1. In GitHub repository settings, add the project ID secrets:
   - `FIREBASE_PROJECT_ID_DEV`: Your development project ID (e.g., `my-app-dev`)
   - `FIREBASE_PROJECT_ID_PROD`: Your production project ID (e.g., `my-app-prod`)

### Step 6: Create Environment Variable Secrets

Create `.env` file contents for both frontend and functions, for both environments.

**Frontend Environment Variables** (`DEV_FRONTEND_ENV` / `PROD_FRONTEND_ENV`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Functions Environment Variables** (`DEV_FUNCTIONS_ENV` / `PROD_FUNCTIONS_ENV`):
```env
# Add any environment variables your functions need
# For example:
# API_KEY=your_api_key
# EXTERNAL_SERVICE_URL=https://api.example.com
```

Copy the entire contents of your `.env` file (all lines) and paste it as the secret value in GitHub.

## Testing the Workflows

### Test Automatic Deployment to Development

1. Make a change to the frontend or functions code
2. Commit and push to the `main` branch
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy to Development Environment" workflow run
5. Verify only the changed components were deployed

### Test Manual Development Deployment

1. Go to **Actions** tab in GitHub
2. Select "Deploy to Development Environment" workflow
3. Click **Run workflow**
4. Click **Run workflow** (deploys both frontend and functions)
5. Monitor the deployment
6. Verify both frontend and functions are deployed (bypasses change detection)

### Test Manual Production Deployment

1. Go to **Actions** tab in GitHub
2. Select "Deploy to Production Environment" workflow
3. Click **Run workflow**
4. Select what to deploy (frontend, functions, or both)
5. Click **Run workflow**
6. Monitor the deployment
7. Verify production site is updated

## Troubleshooting

### Deployment Fails with "Permission Denied" or "Authentication Error"

**Solution:** 
- Verify the `FIREBASE_TOKEN` is valid and not expired (regenerate with `firebase login:ci` if needed)
- Ensure the service account has the correct roles assigned (Firebase Admin, Cloud Functions Developer, Firebase Hosting Admin)
- Check that both `FIREBASE_TOKEN` and `GCP_SA_KEY` (service account) secrets are set

### "Project not found" Error

**Solution:** Double-check that the `FIREBASE_PROJECT_ID_TEST` or `FIREBASE_PROJECT_ID_PROD` secret matches your actual Firebase project ID.

### Frontend Build Fails with "Environment Variable" Errors

**Solution:** 
- Verify that `DEV_FRONTEND_ENV` or `PROD_FRONTEND_ENV` secret is set correctly
- Ensure all required `VITE_` prefixed variables are included
- Check that the `.env` format is correct (no extra quotes or spaces)

### Functions Build Fails

**Solution:** 
- Check that all dependencies are in `functions/package.json`
- Ensure TypeScript compiles without errors
- Verify Node.js version matches (should be 20)
- Verify `DEV_FUNCTIONS_ENV` or `PROD_FUNCTIONS_ENV` is set if functions require environment variables

### Frontend Builds but Doesn't Deploy

**Solution:** Ensure the build output is in `frontend/dist` directory (as configured in `firebase.json`).

### Workflow Doesn't Trigger

**Solution:**
- Verify you're pushing to the `main` branch
- Check that changes are in `frontend/**` or `functions/**` directories
- Review the workflow file for syntax errors
- For pull requests, ensure the PR is merged (not just closed)

### "Invalid FIREBASE_TOKEN" Error

**Solution:**
- Regenerate the Firebase CI token: `firebase login:ci`
- Update the `FIREBASE_TOKEN_DEV` or `FIREBASE_TOKEN_PROD` secret with the new token
- Note: Firebase tokens may expire and need to be regenerated periodically

## Workflow Architecture

```
main branch push
    ↓
Path Detection
    ↓
┌─────────┬──────────┐
│         │          │
Frontend  Functions  Both
Changes   Changes    Changed
    ↓         ↓         ↓
Deploy    Deploy    Deploy
Frontend  Functions  Both
    ↓         ↓         ↓
Test Environment
```

```
Manual Trigger
    ↓
Select Target
(frontend/functions/both)
    ↓
Deploy Selected
    ↓
Production Environment
```

## GitHub Environments (Optional)

You can configure GitHub environments for additional protection:

1. Go to **Settings > Environments** in your GitHub repository
2. Create environments: `development` and `production`
3. For `production`, you can add:
   - Required reviewers (approvals needed before deployment)
   - Wait timer (delay before deployment)
   - Deployment branches (restrict which branches can deploy)

The workflows are already configured to use these environments if they exist.

## Additional Environment Configuration

### Runtime Environment Variables for Functions

If your functions need runtime configuration beyond the `.env` file (e.g., for secrets), you can use Firebase Functions config or Google Cloud Secret Manager:

**Using Firebase Functions Config:**
```bash
firebase functions:config:set someservice.key="THE API KEY" --project PROJECT_ID
```

**Using Google Cloud Secret Manager (recommended for secrets):**
1. Store secrets in Secret Manager via Google Cloud Console
2. Access them in your functions code using the Secret Manager API

The `.env` file created during deployment is for build-time variables only.

## Additional Resources

- [Firebase Hosting Deploy Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)

