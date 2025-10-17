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

### ✅ Phase 2: Protocol Buffers Implementation (CRITICAL)
- **User.proto Schema:** Complete message definitions for User and UserList
- **Protobuf Export Endpoint:** `GET /api/users/export` returns binary protobuf data
- **Frontend Integration:** Tab-based interface to switch between JSON and Protobuf
- **Binary Serialization:** Proper protobuf encoding/decoding
- **Content-Type Headers:** `application/x-protobuf` with schema information
- **Data Validation:** Only display users with valid protobuf signatures

### 🔄 In Progress
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
│   ├── proto/
│   │   └── User.proto        # Protocol Buffers schema
│   ├── routes/
│   │   └── userRoutes.js     # User API routes
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
├── frontend/                 # React/Vite application
│   ├── public/
│   │   └── proto/
│   │       └── User.proto    # Protocol Buffers schema (frontend)
│   ├── src/
│   │   ├── utils/
│   │   │   └── protobuf.js   # Protobuf utility service
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
   
   # Get all users (JSON)
   curl http://localhost:5000/api/users
   
   # Export users as Protocol Buffers (CRITICAL)
   curl http://localhost:5000/api/users/export \
     -H "Accept: application/x-protobuf"
   
   # Create a user
   curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","role":"user","status":"active"}'
   ```

3. **Use the web interface:**
   - Open http://localhost:3000
   - **JSON Tab:** Create, edit, and delete users (standard CRUD)
   - **Protocol Buffers Tab:** View users loaded via binary protobuf data
   - Switch between data sources to see the difference

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

## 🔧 Protocol Buffers Schema

```protobuf
syntax = "proto3";

message User {
  int32 id = 1;
  string email = 2;
  string role = 3;
  string status = 4;
  int64 createdAt = 5;
}

message UserList {
  repeated User users = 1;
}
```

**Key Features:**
- **Binary Format:** More efficient than JSON
- **Type Safety:** Schema defines exact data structure
- **Cross-Language:** Works with any programming language
- **Backward Compatible:** Can add new fields without breaking existing code

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
