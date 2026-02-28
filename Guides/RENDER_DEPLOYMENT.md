# Render Deployment Guide for Alumni Connect

## Critical Fixes Applied

### Issue 1: Google Login 500 Error
**Problem:** New Google users couldn't sign up because the `/auth/google-login` endpoint required users to exist in MongoDB before they could be created.

**Fix:** Created a new `verifyFirebaseToken` middleware that only verifies the Firebase token without checking MongoDB. The Google login route now uses this lighter middleware.

### Issue 2: Verification Email 500 Error
**Problem:** Email configuration issues and improper FRONTEND_URL handling.

**Fix:**
- Added validation for email credentials
- Fixed FRONTEND_URL parsing to handle comma-separated URLs
- Added trimming for email password to handle spaces

---

## Render Environment Variables Setup

You MUST set these environment variables in your Render dashboard:

### 1. Navigate to Your Service
- Go to https://dashboard.render.com
- Select your `alumni-connect-backend` service
- Click on "Environment" tab

### 2. Set These Variables

#### Database Configuration
```
MONGODB_URI=mongodb+srv://acebitsindridhanbad_db_user:Kamlesh%40%232005@cluster0.atc0s8x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=ALUMNI-CONNECT
```

#### Server Configuration
```
NODE_ENV=production
PORT=5000
```

#### Email Configuration (CRITICAL - Without this, emails won't send)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=alumniconnect.acebitsindri@gmail.com
EMAIL_PASSWORD=jiksefmhoyafgifv
```
**NOTE:** Remove ALL spaces from the password! It should be: `jiksefmhoyafgifv` (no spaces)

#### Frontend URL (CRITICAL - Must be your deployed frontend URL)
```
FRONTEND_URL=https://your-frontend-app.netlify.app
```
**Replace with your actual frontend URL** (NOT localhost!)

#### JWT Configuration
```
JWT_SECRET=ace_bit_sindri_alumni_connect_secret_key_2024
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=ace_bit_sindri_refresh_token_secret_2024
JWT_REFRESH_EXPIRE=30d
```

#### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=dethhxmyj
CLOUDINARY_API_KEY=628492318989999
CLOUDINARY_API_SECRET=rOZytw-HqvuuJaYsE8yRzAXUjg8
```

### 3. Deploy the Latest Code

After setting the environment variables:

1. **Commit and push your changes:**
```bash
git add .
git commit -m "Fix Google login and email verification issues"
git push origin main
```

2. **Trigger a deploy in Render:**
   - Go to your service dashboard
   - Click "Manual Deploy" → "Deploy latest commit"
   - OR it will auto-deploy if you have auto-deploy enabled

### 4. Verify the Deployment

After deployment completes:

1. **Check the logs:**
   - Click on "Logs" tab in Render dashboard
   - Look for any errors during startup
   - Verify email configuration is loaded correctly

2. **Test the endpoints:**
   - Try registering a new user with email/password
   - Check if verification email is sent
   - Try Google signup with a new Google account
   - Try Google login with an existing Google account

---

## Common Issues and Solutions

### Issue: "Email configuration is missing" error
**Solution:** Make sure EMAIL_USER and EMAIL_PASSWORD are set in Render environment variables (not just in the .env file)

### Issue: Verification email has localhost URL
**Solution:** Set FRONTEND_URL in Render to your actual deployed frontend URL (e.g., `https://alumni-connect.netlify.app`)

### Issue: Email not sending
**Solutions:**
1. Verify the Gmail app password is correct (no spaces!)
2. Make sure the Gmail account has "Less secure app access" enabled OR is using an App Password
3. Check Render logs for specific email errors

### Issue: Google login still fails
**Solution:**
1. Clear browser cache
2. Make sure the latest code is deployed
3. Check that Firebase configuration is correct in Render

---

## Firebase Service Account

Make sure your Firebase service account JSON is properly configured. The backend already has this in the `.env` file, but for production, you should:

1. Create a `serviceAccountKey.json` file in the backend root (add it to .gitignore!)
2. OR set it as an environment variable in Render (for better security)

---

## Testing Checklist

After deployment, test these scenarios:

- [ ] New user registration with email/password
- [ ] Verification email is received
- [ ] Email verification link works
- [ ] Resend verification email works
- [ ] New Google user signup (first time)
- [ ] Existing Google user login
- [ ] Existing email user login
- [ ] Password reset email
- [ ] All emails have correct frontend URLs (not localhost)

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Make sure Firebase configuration matches between frontend and backend
