# Deployment Guide for Render + Vercel

## Backend (Render) Environment Variables

Set these environment variables in your Render dashboard:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

## Frontend (Vercel) Environment Variables

Set these environment variables in your Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend-render-url.onrender.com
```

## Key Changes Made for Production

### 1. Cookie Configuration
- Updated JWT cookies to work with cross-origin requests
- `secure: true` only in production
- `sameSite: 'None'` in production to allow cross-site cookies

### 2. CORS Configuration
- Added `exposedHeaders: ["Set-Cookie"]` to allow cookie transmission
- Ensure `credentials: true` is set

### 3. Error Handling
- Added missing `return` statements in error responses
- Fixed async/await issues in OTP validation

## Common Issues and Solutions

### Issue: "Token not found" error
**Solution**: Check that cookies are being sent properly from frontend
- Ensure `credentials: 'include'` in fetch/axios requests
- Verify CORS configuration allows credentials

### Issue: CORS errors
**Solution**: 
- Verify `FRONTEND_URL` environment variable is set correctly
- Check that frontend is making requests to the correct backend URL

### Issue: OTP validation fails
**Solution**:
- Check email configuration in Render environment variables
- Verify MongoDB connection string is correct

## Testing Your Deployment

1. Test user registration with OTP
2. Test user login
3. Test protected routes
4. Test logout functionality

## Frontend Configuration

Make sure your frontend API calls include:

```javascript
// For fetch
fetch('/api/v1/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})

// For axios
axios.defaults.withCredentials = true;
``` 