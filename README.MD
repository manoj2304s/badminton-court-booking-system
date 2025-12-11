# 🏸 Sports Facility Booking Platform - Complete Setup Guide

## Project Overview

A full-stack court booking platform with multi-resource scheduling, dynamic pricing, and real-time availability checking.

**Tech Stack:**
- **Backend**: Node.js + Express + MySQL + Sequelize
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: JWT
- **State Management**: Context API

---

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js v16+ 
- MySQL v8.0+ 
- Git 
- Code editor (VS Code)
- Postman (optional)

---

## 🚀 Installation Guide

### Step 1: Clone or Create Project Structure

```bash
mkdir sports-booking-platform
cd sports-booking-platform
mkdir backend frontend
```

### Step 2: Backend Setup

```bash
cd backend
npm init -y
```

**Install Backend Dependencies:**
```bash
npm install express mysql2 sequelize dotenv bcryptjs jsonwebtoken cors
npm install --save-dev nodemon
```

**Create MySQL Database:**
```sql
mysql -u root -p
CREATE DATABASE sports_booking;
EXIT;
```

**Create .env file in backend folder:**
```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
NODE_ENV=
```

**Start Backend:**
```bash
# Seed database with test data
npm run seed

# Start development server
npm run dev
```

Backend should now be running on `http://localhost:5000`

---

### Step 3: Frontend Setup

```bash
cd ../frontend
npm create vite@latest . -- --template react
```

**Install Frontend Dependencies:**
```bash
npm install
npm install react-router-dom axios date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Create .env file in frontend folder:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

Frontend should now be running on `http://localhost:3000`

---

## 🧪 Testing the Application

### 1. Test Backend API (Optional)

Open Postman and test:

**Health Check:**
```
GET http://localhost:5000/health
```

### 2. Test Frontend Application

Open browser to `http://localhost:3000`


## 📊 Seeded Data Reference

After running `npm run seed`, you'll have:


## 🎯 Key Features to Demonstrate

### 1. Multi-Resource Booking
- Select court + coach + equipment in single booking
- All resources checked atomically
- Booking fails if any resource unavailable

### 2. Dynamic Pricing
- Base price changes by court type
- Rules stack (indoor + peak + weekend)
- Live calculation as options change
- Detailed breakdown shown

### 3. Availability Checking
- Real-time validation
- Checks court, coach, equipment simultaneously
- Shows specific conflicts
- Prevents double booking

### 4. Admin Configuration
- Create/edit courts
- Manage equipment inventory
- Configure coach availability
- Create pricing rules dynamically

---

## 🚨 Common Issues & Solutions

### Backend Issues

**Database Connection Failed**
```bash
# Check MySQL is running
sudo service mysql status

# Verify credentials in .env
# Try connecting manually:
mysql -u root -p sports_booking
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

**Seeding Fails**
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE sports_booking;
CREATE DATABASE sports_booking;
EXIT;

# Run seed again
npm run seed
```

### Frontend Issues

**API Calls Fail**
- Check backend is running on port 5000
- Verify VITE_API_URL in .env
- Check browser console for errors
- Verify no CORS issues

**Styles Not Showing**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Restart dev server
npm run dev
```

**Token Expired**
- Tokens last 30 days
- Simply login again
- Clear localStorage if needed

---

## 📦 Deployment Checklist

### Backend (Heroku Example)

1. Create Heroku app
2. Add MySQL addon (ClearDB or JawsDB)
3. Set environment variables
4. Deploy:
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```
5. Run seed command on Heroku

### Frontend (Netlify Example)

1. Build production bundle:
```bash
npm run build
```
2. Deploy `dist/` folder to Netlify
3. Set environment variable: `VITE_API_URL`
4. Configure redirects for SPA

---

## 📈 Project Structure Overview

```
sports-booking-platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```


## 🎓 Learning Outcomes

1. **Full-Stack Development**: Backend API + Frontend integration
2. **Database Design**: Relational schemas with complex relationships
3. **Business Logic**: Multi-resource booking, pricing engines
4. **Authentication**: JWT-based auth flow
5. **State Management**: Context API + local state
6. **API Design**: RESTful endpoints, CRUD operations
7. **Real-Time Features**: Live availability checking
8. **Transaction Management**: Atomic database operations
9. **Modern React**: Hooks, routing, context
10. **Responsive Design**: Tailwind CSS, mobile-first

---

**Next Steps:**
- Add email notifications
- Implement payment gateway
- Add booking calendar view
- Create mobile app
- Add analytics dashboard
- Implement websockets for real-time updates

---
