# 🚀 Admin Panel Quick Start Guide

## Getting Started

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend should be running on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend should be running on `http://localhost:3000`

### 3. Access the Admin Panel

Navigate to: **http://localhost:3000/admin**

You will be redirected to login if not authenticated.

## 🔑 Admin Login

To access the admin panel, you need to login with an admin account.

### Option 1: Use Existing Admin Account
If you already have an admin user in your database, login with those credentials.

### Option 2: Create Admin User via MongoDB

Connect to your MongoDB database and update a user to be an admin:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

### Option 3: Register and Manually Set Admin

1. Register a new account at `/register`
2. Update the user in MongoDB to set `isAdmin: true`
3. Login again

## 📍 Admin Panel Routes

Once logged in as admin, you can access:

- **Dashboard**: `/admin/dashboard` - Overview with statistics and charts
- **Products**: `/admin/products` - Manage rental products
- **Users**: `/admin/users` - Manage registered users
- **Rentals**: `/admin/rentals` - Manage rental orders

## 🎯 Quick Actions

### Add a New Product

1. Go to `/admin/products`
2. Click "Add Product" button
3. Fill in the form:
   - Product Name (e.g., "MacBook Pro 14-inch M4")
   - Description
   - Category (Apple, IT Products, DSLR, etc.)
   - Brand
   - Rental Price (per month)
   - Security Deposit
   - Stock Quantity
   - Condition (New/Good/Fair)
   - City and State
4. Click "Add Product"

### Edit a Product

1. Go to `/admin/products`
2. Click the edit icon (pencil) on any product
3. Update the fields
4. Click "Update Product"

### Delete a Product

1. Go to `/admin/products`
2. Click the delete icon (trash) on any product
3. Confirm deletion

### Manage Rental Orders

1. Go to `/admin/rentals`
2. View all rental orders
3. Click "Mark Paid" for pending payments
4. Click "Mark Delivered" for paid orders

### Manage Users

1. Go to `/admin/users`
2. View all registered users
3. Click "Delete" to remove users

## 🎨 Features Overview

### Dashboard
- Total Revenue with growth metrics
- Active users count
- Total products and rentals
- Revenue chart (monthly breakdown)
- Leads-to-clients funnel
- Recent rentals table
- To-do lists

### Products Management
- Full CRUD operations
- Search by name or category
- Filter by category
- Product images support
- Stock tracking
- Location-based filtering

### Users Management
- View all users in card layout
- User role badges (Admin/User)
- Contact information
- Join date tracking
- Search and filter capabilities

### Rentals Management
- Order tracking with unique IDs
- Customer information
- Payment status tracking
- Delivery status updates
- Quick status updates
- Search and filter

## 🔧 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API endpoints in frontend code

### "Unauthorized" errors
- Ensure you're logged in as admin
- Check if `isAdmin` is set to `true` in database
- Verify JWT token is valid

### Charts not displaying
- Ensure `react-chartjs-2` and `chart.js` are installed
- Check browser console for errors
- Verify data is being fetched from API

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` includes admin paths
- Verify all Tailwind classes are valid

## 📝 Notes

- All admin routes are protected with authentication middleware
- Only users with `isAdmin: true` can access admin panel
- All API calls require JWT token in Authorization header
- Data is fetched from MongoDB via Express API

## 🎉 You're All Set!

Your admin panel is now ready to use. Navigate to `/admin/dashboard` to start managing your IndianRentals platform!

For detailed documentation, see `ADMIN_PANEL_README.md`
