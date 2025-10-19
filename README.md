# Full-Stack JavaScript Admin Panel

A professional admin panel implementing user management with Protocol Buffers, cryptography, and data visualization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation & Setup

1. **Clone and navigate to project:**
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on http://localhost:5000

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## ✅ Requirements Implementation

### 1. User Management System
- **CRUD Operations:** Create, Read, Update, Delete users
- **User Fields:** ID, email, role (admin/user), status (active/inactive), createdAt
- **Database:** SQLite with better-sqlite3
- **Pagination:** Load More functionality (25 users per page)

### 2. Protocol Buffers (CRITICAL)
- **Schema:** `User.proto` with User and UserList messages
- **Backend:** `/api/users/export` endpoint returns binary protobuf data
- **Frontend:** Tab-based interface with protobuf decoding
- **Content-Type:** `application/x-protobuf` headers

### 3. Cryptography
- **SHA-384 Hashing:** Email hashing for data integrity
- **RSA Digital Signatures:** User data signing with RSA-PSS
- **Frontend Verification:** Real-time signature validation
- **Public Key Endpoint:** `/api/users/public-key` for verification

### 4. Data Visualization
- **Chart.js Integration:** Interactive line and bar charts
- **7-Day Trend:** User creation visualization
- **Summary Cards:** Total users, today's users, weekly average
- **Real-time Updates:** Live chart data refresh

## 🏗️ Architecture

```
admin-panel/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── models/             # User model with crypto
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   ├── services/           # Crypto service
│   └── proto/              # Protocol Buffers schema
├── frontend/               # React + Vite
│   ├── src/components/     # Chart components
│   ├── src/utils/          # Protobuf & Crypto utils
│   └── public/proto/       # Protocol Buffer schemas
└── database.sqlite         # SQLite database
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Paginated user list |
| `/api/users/export` | GET | Protocol Buffers export |
| `/api/users/chart-data` | GET | Chart data (7-day trend) |
| `/api/users/public-key` | GET | RSA public key |
| `/api/users/seed` | GET | Test data seeding |
| `/api/users` | POST | Create user |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Delete user |

## 🔐 Security Features

- **SHA-384 Hashing:** Email integrity verification
- **RSA Digital Signatures:** User data authenticity
- **Signature Verification:** Frontend validation
- **Environment Variables:** Secure configuration

## 📈 Features

### User Interface
- **3 Tabs:** JSON API, Protocol Buffers, Charts
- **Pagination:** Load More button (25 users per page)
- **Responsive Design:** Mobile-friendly interface
- **Auto-dismissing Notifications:** Better UX

### Data Visualization
- **Interactive Charts:** Line and Bar chart types
- **Summary Statistics:** User metrics dashboard
- **Real-time Data:** Live chart updates
- **Chart Controls:** Type switching and refresh

### Performance
- **Pagination:** Efficient data loading
- **Progressive Loading:** Load more on demand
- **Optimized Queries:** Database performance
- **Caching:** Public key caching

## 🧪 Testing

### Test Data Seeding
```bash
# Seed test data (38 users across 10 days)
curl http://localhost:5000/api/users/seed
```

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get users (JSON)
curl http://localhost:5000/api/users

# Export users (Protocol Buffers)
curl http://localhost:5000/api/users/export \
  -H "Accept: application/x-protobuf"

# Get chart data
curl http://localhost:5000/api/users/chart-data
```

## 🔧 Environment Variables

Create `.env` file in backend directory:
```bash
PORT=5000
HOST=localhost
DATABASE_URL=./database.sqlite
NODE_ENV=development
```

## 📋 Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
  status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
  emailHash TEXT,           -- SHA-384 hash
  signature TEXT,           -- RSA digital signature
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Technical Stack

- **Backend:** Node.js, Express.js, SQLite, better-sqlite3
- **Frontend:** React, Vite, Chart.js, react-chartjs-2
- **Cryptography:** Node.js crypto module, SHA-384, RSA-PSS
- **Serialization:** Protocol Buffers (protobufjs)
- **Architecture:** MVC pattern, ES modules

## 🚀 Production Ready

- ✅ **Professional Architecture:** MVC pattern with proper separation
- ✅ **Security:** Cryptography and signature verification
- ✅ **Performance:** Pagination and optimized queries
- ✅ **User Experience:** Responsive design and progressive loading
- ✅ **Data Visualization:** Interactive charts and real-time updates
- ✅ **API Design:** RESTful endpoints with proper error handling

## 📝 License

MIT License - See LICENSE file for details

---

**This implementation demonstrates professional full-stack development skills with modern JavaScript, security best practices, and user-centered design.**