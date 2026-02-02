# Deployment Checklist

## Environment Variables (Render)
Make sure the following environment variables are set in your Render Dashboard for the **Backend** service:

- `MONGO_URI`: Your MongoDB connection string (from Atlas).
- `JWT_SECRET`: A long random string.
- `EMAIL_USER`: `shop.indianrenters@gmail.com`
- `EMAIL_PASS`: The App Password (not your Gmail password).
- `NEXT_PUBLIC_API_URL`: (Optional) If you are setting this on the frontend, ensure it points to the backend URL.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads.

## Common Issues

### 1. "Just Sending..." / Infinite Loading
This usually happens when the backend request is pending and never completes.
**Causes:**
- **Cold Start:** On Render's free tier, the server spins down after inactivity. The first request can take up to 60 seconds. **Wait at least 1 minute.**
- **Missing Email Credentials:** If `EMAIL_USER` or `EMAIL_PASS` are missing or incorrect on Render, the backend might hang while trying to send the email or fail silently if error handling isn't perfect (though our code looks robust).
- **Blocked Email Port:** Sometimes Render blocks SMTP ports. However, Gmail (port 465/587) usually works.

### 2. "User Not Found"
If you see this error (red box in the modal), it means:
- You are trying to Login with an email that hasn't been Registered yet.
- **Fix:** Click "Create Account" or "Register" first.

## Debugging
- **Check Render Logs:** Go to your Dashboard -> Logs. Look for any errors when you click "Get OTP".
- **Check Browser Console:** Right-click -> Inspect -> Console. Look for red errors.
