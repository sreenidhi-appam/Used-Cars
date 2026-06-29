# Image Upload Fix

## Problem
The image upload feature was failing with "Image upload failed. Please try again." because:

1. **Hardcoded API URL**: The frontend was hardcoded to use `http://localhost:5000`, which doesn't work if:
   - The backend server isn't running
   - The app is accessed from a different machine
   - The server is running on a different port

2. **Missing Server**: The backend Express server needs to be running for image uploads to work

3. **Poor Error Messages**: Users couldn't see what actually went wrong

## Solution

### 1. **Dynamic API Configuration** (`src/config.ts`)
- Created a configuration system that automatically detects the correct API URL
- Supports environment variable override via `VITE_API_BASE_URL`
- Defaults to `http://localhost:5000` for development

### 2. **Improved Error Handling**
- Added detailed error logging in both frontend and backend
- Users now see the actual error reason instead of a generic message
- Backend provides helpful debug information

### 3. **Updated Server** (`server.js`)
- Added file count validation
- Better error logging for debugging

## How to Run

### **Important: Always run both frontend AND backend**

#### Option 1: Run both together (Recommended)
```bash
npm run dev:full
```
This runs the Express server on port 5000 and the Vite dev server on port 3000.

#### Option 2: Run separately in different terminals

**Terminal 1 - Start the backend server:**
```bash
npm run server
```
(Runs on `http://localhost:5000`)

**Terminal 2 - Start the frontend dev server:**
```bash
npm run dev
```
(Runs on `http://localhost:3000`)

## Configuration

### Development
Create a `.env.local` file (or use `.env.example` as reference):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production
Set the environment variable before building:
```bash
export VITE_API_BASE_URL=https://your-api-server.com
npm run build
```

## Testing the Upload Feature

1. Navigate to **"SELL OR TRADE-IN YOUR CAR"** section
2. Go to **"2. Sell My Car Online"** tab
3. Fill in Step 1 & 2 (car basics and details)
4. In **Step 3 - Upload Vehicle Images**, either:
   - Drag and drop images
   - Click to browse and select images

You should see the upload progress and success confirmation.

## Troubleshooting

If you still see "Image upload failed":

1. **Check if both servers are running:**
   ```bash
   # Check if Express server is running on port 5000
   curl http://localhost:5000/api/cars
   
   # Check if Vite server is running on port 3000
   curl http://localhost:3000
   ```

2. **Check the browser console** (F12 → Console tab) for detailed error messages

3. **Check the terminal** where the server is running for error logs

4. **Ensure uploads directory exists:**
   - The server creates `public/uploads/` automatically
   - Check that you have write permissions in the project directory

5. **File size limits:**
   - Maximum file size is 8MB per image
   - Only image files are allowed (JPG, PNG, WebP, GIF, etc.)
