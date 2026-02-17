# 🚀 Admin Panel Access Guide

## ✅ Fixed Authentication Issue

The admin panel authentication has been fixed! The issue was that the login system stores user data as `userInfo` in localStorage, but the admin panel was looking for separate `user` and `token` fields.

---

## 📋 How to Access the Admin Panel

### **Step 1: Make Sure Servers Are Running**

Both servers should be running (they already are! ✅):
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`

---

### **Step 2: Create an Admin User**

You need a user account with admin privileges. Here are your options:

#### **Option A: Use the Helper Script (Easiest)**

1. **Register a new user** (if you don't have one):
   - Go to `http://localhost:3000/register`
   - Fill in your details and complete registration

2. **Make the user an admin**:
   ```bash
   cd backend
   node make_admin.js your-email@example.com
   ```
   Replace `your-email@example.com` with the email you registered with.

#### **Option B: Update MongoDB Directly**

Using MongoDB Compass or MongoDB Shell:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

---

### **Step 3: Login**

1. Go to `http://localhost:3000/login`
2. Enter your email or phone
3. Get OTP (check console for `debugOtp` if email isn't working)
4. Enter OTP and login

---

### **Step 4: Access Admin Panel**

Once logged in, navigate to:
👉 **`http://localhost:3000/admin`**

This will automatically redirect you to the dashboard if you're an admin.

---

## 🎯 Admin Panel URLs

After logging in as admin, you can access:

| Page | URL |
|------|-----|
| **Dashboard** | `http://localhost:3000/admin/dashboard` |
| **Products** | `http://localhost:3000/admin/products` |
| **Users** | `http://localhost:3000/admin/users` |
| **Rentals** | `http://localhost:3000/admin/rentals` |
| **KYC** | `http://localhost:3000/admin/kyc` |
| **Settings** | `http://localhost:3000/admin/settings` |

---

## 🔧 What Was Fixed

### **Backend Changes**
- ✅ Added `isAdmin` field to login response in `authController.js`
- ✅ Login now returns: `{ _id, name, email, phone, role, isAdmin, token }`

### **Frontend Changes**
- ✅ Updated `admin/page.js` to check `userInfo.isAdmin` instead of separate `user.isAdmin`
- ✅ Updated `admin/dashboard/page.js` to use `userInfo.token` for API calls
- ✅ Added proper authentication flow with redirect logic

### **Helper Script**
- ✅ Created `backend/make_admin.js` to easily make any user an admin

---

## 🔍 Troubleshooting

### **Issue: "Access denied. Admin privileges required"**
**Solution**: Your user doesn't have admin privileges. Run the make_admin script:
```bash
cd backend
node make_admin.js your-email@example.com
```

### **Issue: Redirects to login even when logged in**
**Solution**: 
1. Clear browser localStorage: `localStorage.clear()` in console
2. Login again
3. Make sure your user has `isAdmin: true` in the database

### **Issue: "No token found" error**
**Solution**: 
1. Logout and login again
2. Check if `userInfo` exists in localStorage (F12 → Application → Local Storage)
3. Should see: `{ _id, name, email, token, isAdmin, ... }`

### **Issue: Can't get OTP**
**Solution**: 
1. Check backend console for the `debugOtp` value
2. Use that OTP to login
3. Email/SMS might not be configured yet

---

## 📊 Quick Test

To verify everything is working:

1. **Login**: `http://localhost:3000/login`
2. **Check localStorage**: 
   ```javascript
   // In browser console (F12)
   JSON.parse(localStorage.getItem('userInfo'))
   // Should show: { isAdmin: true, token: "...", ... }
   ```
3. **Access Admin**: `http://localhost:3000/admin`
4. **Should redirect to**: `http://localhost:3000/admin/dashboard`

---

## ✨ Features Available

Once in the admin panel, you can:

- ✅ **Dashboard**: View statistics, charts, and recent activity
- ✅ **Products**: Add, edit, delete rental products
- ✅ **Users**: Manage registered users
- ✅ **Rentals**: Track and update rental orders
- ✅ **KYC**: Approve or reject KYC submissions
- ✅ **Settings**: Configure admin preferences

---

## 🎉 You're All Set!

The admin panel is now fully functional and ready to use!

**Quick Access**: `http://localhost:3000/admin`

Need help? Check the other documentation files:
- `ADMIN_PANEL_README.md` - Full documentation
- `ADMIN_QUICK_START.md` - Quick start guide
- `KYC_MANAGEMENT_FEATURE.md` - KYC feature details
