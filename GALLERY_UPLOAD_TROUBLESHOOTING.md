# Gallery Upload Troubleshooting Guide

## Issue: Gallery image upload not working

### Quick Fixes to Try:

### 1. **Check Environment Variables**
Make sure these are set in your `.env` file:
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"  
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. **Test Cloudinary Configuration**
Visit: `http://localhost:3000/api/test-cloudinary`

This will show you if Cloudinary is configured correctly.

### 3. **Check File Requirements**
- File must be an image (jpg, png, gif, webp, etc.)
- File size must be less than 10MB
- Make sure you've selected a file before submitting

### 4. **Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for error messages

### 5. **Check Network Tab**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try uploading an image
4. Look for failed requests to `/api/admin/gallery`

### 6. **Restart Development Server**
Sometimes configuration changes require a restart:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 7. **Check Server Logs**
Look at your terminal where you're running `npm run dev` for error messages.

## Common Error Messages:

### "Cloudinary configuration missing"
- Check your `.env` file has all three Cloudinary variables
- Make sure there are no typos in the variable names
- Restart your development server after adding variables

### "Failed to create image"
- Check the browser console for more details
- Verify the file is a valid image
- Check file size is under 10MB

### "Unauthorized"
- Make sure you're logged in as an admin user
- Check that your user has `role: 'ADMIN'` in the database

## Debug Steps:

1. **Test Cloudinary**: Visit `/api/test-cloudinary`
2. **Check file selection**: Make sure file name appears after selecting
3. **Check console**: Look for detailed error messages
4. **Check network**: See if the request is being sent
5. **Check server logs**: Look at terminal output

## If Still Not Working:

1. Try uploading a very small image (< 1MB)
2. Try a different image format (PNG instead of JPG)
3. Check if other admin functions work (pricing, frames, etc.)
4. Clear browser cache and cookies
5. Try in an incognito/private browser window

## Enhanced Debugging:

The gallery upload now includes detailed logging:
- File information is logged to console
- Server-side logging shows each step
- Better error messages with specific details
- File validation before upload

Check both browser console and server terminal for detailed information about what's happening during the upload process.