# Admin Panel

A professional mini admin panel with React frontend and Node.js backend, implementing user CRUD operations, Protocol Buffers, and cryptographic signatures.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Environment Setup
1. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your configuration (optional - defaults are provided)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```
   
   The backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on http://localhost:3000

## 📋 Features Implemented

### ✅ Phase 1: Basic CRUD Operations
- **User Management:** Create, read, update, delete users
- **User Fields:** id, email, role (admin/user), status (active/inactive), createdAt
- **Database:** SQLite with better-sqlite3
- **API Endpoints:**
  - `GET /api/users` - List all users
  - `POST /api/users` - Create user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `GET /api/health` - Health check

### 🔄 In Progress
- **Protocol Buffers:** User export endpoint (CRITICAL)
- **Cryptography:** SHA-384 hashing and RSA signatures
- **Charts:** User creation visualization

## 🏗️ Project Structure

```
admin-panel/
├── .gitignore                 # Git ignore rules
├── env.example               # Environment variables template
├── README.md                 # This file
├── backend/                  # Node.js/Express API
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   └── userController.js # User business logic
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling
│   ├── models/
│   │   └── User.js           # User data model
│   ├── routes/
│   │   └── userRoutes.js     # User API routes
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
├── frontend/                 # React/Vite application
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
└── database.sqlite          # SQLite database (auto-created)
```

## 🧪 Testing the Application

1. **Start both servers:**
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm run dev`

2. **Test the API directly:**
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # Get all users
   curl http://localhost:5000/api/users
   
   # Create a user
   curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","role":"user","status":"active"}'
   ```

3. **Use the web interface:**
   - Open http://localhost:3000
   - Create, edit, and delete users
   - See real-time updates

## 📊 Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
  status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development Notes

### Architecture
- **MVC Pattern:** Model-View-Controller separation for maintainability
- **ES Modules:** Modern JavaScript import/export syntax
- **Environment Variables:** Configuration via .env file
- **Error Handling:** Centralized error management

### Features
- **Database:** SQLite file is created automatically on first run
- **CORS:** Enabled for frontend-backend communication
- **Auto-dismissing Notifications:** User-friendly feedback system
- **Responsive Design:** Mobile-friendly interface
- **Professional Structure:** Industry-standard code organization

## ⚙️ Environment Variables

Copy `env.example` to `.env` and configure as needed:

```bash
# Server Configuration
PORT=5000
HOST=localhost

# Database
DATABASE_URL=./database.sqlite

# Security (for crypto implementation)
JWT_SECRET=your-super-secret-jwt-key-here
RSA_PRIVATE_KEY_PATH=./keys/private.pem
RSA_PUBLIC_KEY_PATH=./keys/public.pem

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📝 Next Steps

1. **Protocol Buffers Implementation** (CRITICAL)
   - Create User.proto file
   - Implement /api/users/export endpoint
   - Frontend protobuf decoding

2. **Cryptography Implementation**
   - SHA-384 email hashing
   - RSA digital signatures
   - Frontend signature verification

3. **Chart Implementation**
   - User creation data visualization
   - 7-day trend chart

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check Node.js version (v16+)

**Frontend won't start:**
- Check if port 3000 is available
- Ensure all dependencies are installed
- Check for any console errors

**Database issues:**
- Delete database.sqlite file to reset
- Check file permissions
- Ensure better-sqlite3 is properly installed
