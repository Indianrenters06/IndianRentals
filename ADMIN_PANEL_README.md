# IndianRentals Admin Panel

A comprehensive, modern admin dashboard for managing the IndianRentals platform with full CRUD operations for products, users, and rental orders.

## 🎨 Design Features

The admin panel is built with a premium, modern design inspired by contemporary SaaS dashboards:

- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile
- **Modern UI Components**: Clean cards, smooth transitions, and intuitive navigation
- **Rich Data Visualization**: Interactive charts using Chart.js for revenue and analytics
- **Collapsible Sidebar**: Space-efficient navigation with icon-only mode
- **Search & Filters**: Advanced filtering and search capabilities across all modules
- **Real-time Updates**: Live statistics and data updates

## 📁 File Structure

```
frontend/src/app/admin/
├── layout.js              # Admin layout with sidebar and header
├── dashboard/
│   └── page.js           # Dashboard with stats, charts, and overview
├── products/
│   └── page.js           # Products management (CRUD operations)
├── users/
│   └── page.js           # Users management
└── rentals/
    └── page.js           # Rentals/Orders management

backend/
├── controllers/
│   └── adminController.js # All admin API controllers
└── routes/
    └── adminRoutes.js     # Admin API routes
```

## 🚀 Features

### 1. Dashboard (`/admin/dashboard`)
- **Key Metrics Cards**:
  - Total Revenue with growth percentage
  - Total Subscriptions/Rentals
  - Total Products in inventory
  - Active Users (last 24 hours)
  
- **Revenue Chart**: Interactive bar chart showing monthly revenue trends
- **Leads Funnel**: Visual representation of customer conversion stages
- **Recent Rentals Table**: Latest rental orders with status
- **To-Do Lists**: Task management with toggle switches

### 2. Products Management (`/admin/products`)
- **View All Products**: Comprehensive table with product details
- **Add New Product**: Modal form with all product fields
- **Edit Product**: Update existing product information
- **Delete Product**: Remove products from inventory
- **Search & Filter**: Find products by name, category
- **Product Details**:
  - Name, Description, Category, Brand
  - Rental Price, Security Deposit
  - Stock Quantity, Condition
  - Location (City, State)
  - Product Images

### 3. Users Management (`/admin/users`)
- **View All Users**: Card-based layout with user information
- **User Details**:
  - Name, Email, Phone
  - Role (Admin/User)
  - Location, Join Date
- **Delete Users**: Remove user accounts
- **Search & Filter**: Find users by name, email, or role
- **Export Users**: Download user data

### 4. Rentals Management (`/admin/rentals`)
- **View All Rentals**: Comprehensive order tracking table
- **Order Details**:
  - Order ID, Customer Information
  - Order Date, Total Amount
  - Payment Status, Delivery Status
- **Update Status**:
  - Mark as Paid
  - Mark as Delivered
- **Search & Filter**: Find orders by customer or status
- **Export Reports**: Download rental data

## 🔐 API Endpoints

### Dashboard
```
GET /api/admin/stats - Get dashboard statistics
```

### Products
```
GET    /api/admin/products     - Get all products
POST   /api/admin/products     - Create new product
PUT    /api/admin/products/:id - Update product
DELETE /api/admin/products/:id - Delete product
```

### Users
```
GET    /api/admin/users     - Get all users
GET    /api/admin/users/:id - Get user by ID
PUT    /api/admin/users/:id - Update user
DELETE /api/admin/users/:id - Delete user
```

### Rentals
```
GET /api/admin/rentals     - Get all rentals
PUT /api/admin/rentals/:id - Update rental status
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization library
- **react-chartjs-2**: React wrapper for Chart.js
- **react-icons**: Icon library (Feather Icons)

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB

## 📦 Installation

1. **Install Frontend Dependencies**:
```bash
cd frontend
npm install react-chartjs-2 chart.js react-icons
```

2. **Backend is already set up** with all controllers and routes

## 🎯 Usage

### Accessing the Admin Panel

1. **Login as Admin**: Navigate to `/login` and use admin credentials
2. **Access Dashboard**: Go to `/admin/dashboard`
3. **Navigate**: Use the sidebar to access different modules

### Admin Authentication

All admin routes are protected with middleware:
- `protect`: Ensures user is authenticated
- `admin`: Ensures user has admin privileges

### Managing Products

1. Click "Products" in the sidebar
2. Click "Add Product" to create new products
3. Click edit icon to modify existing products
4. Click delete icon to remove products
5. Use search and filters to find specific products

### Managing Users

1. Click "Users" in the sidebar
2. View all registered users in card layout
3. Click "Delete" to remove users
4. Use search to find specific users

### Managing Rentals

1. Click "Rentals" in the sidebar
2. View all rental orders in table format
3. Click "Mark Paid" for pending payments
4. Click "Mark Delivered" for paid orders
5. Use filters to view specific order statuses

## 🎨 Design Customization

### Color Scheme
The admin panel uses a professional color palette:
- **Primary**: Indigo (#6366F1)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray shades

### Modifying Colors
Update Tailwind classes in the components:
```jsx
// Change primary color from indigo to blue
className="bg-indigo-600" → className="bg-blue-600"
```

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop**: Full sidebar with all features
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with overlay sidebar

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin-only routes
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Middleware protection for all admin endpoints

## 🚀 Future Enhancements

Potential features to add:
- [ ] Bulk operations (delete multiple items)
- [ ] Advanced analytics and reporting
- [ ] Email notifications for orders
- [ ] Image upload for products
- [ ] Invoice generation
- [ ] Activity logs
- [ ] Export to CSV/PDF
- [ ] Dark mode toggle
- [ ] Real-time notifications

## 📄 License

This admin panel is part of the IndianRentals project.

## 👨‍💻 Support

For issues or questions, please contact the development team.
