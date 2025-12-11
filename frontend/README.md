# Sports Facility Booking Platform - Frontend

A modern, responsive React application for booking sports facilities with real-time availability checking and dynamic pricing.

## 🎨 Features

### User Features
- **Authentication**: Secure login/register with JWT tokens
- **Real-Time Booking**: Live availability checking across multiple resources
- **Dynamic Price Calculator**: See price breakdown as you select options
- **Resource Selection**: Choose courts, coaches, and equipment
- **Booking Management**: View, filter, and cancel bookings
- **Responsive Design**: Mobile-first, works on all devices

### Admin Features
- **Resource Management**: CRUD operations for courts, equipment, coaches
- **Pricing Rule Configuration**: Create and manage dynamic pricing rules
- **Booking Overview**: View all bookings with filters
- **Dashboard**: Tabbed interface for easy management

## 🛠 Tech Stack

- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **State Management**: Context API + Local State

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5000

## 🚀 Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

4. **Start development server**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Login, Register
│   ├── booking/           # Booking form, list, slots
│   ├── common/            # Reusable components
│   └── layout/            # Navbar, Footer
├── context/
│   └── AuthContext.jsx    # Auth state management
├── pages/
│   ├── HomePage.jsx       # Landing page
│   ├── AdminPage.jsx      # Admin dashboard
│   └── ...
├── services/
│   ├── api.js            # Axios configuration
│   ├── authService.js    # Auth API calls
│   ├── bookingService.js # Booking API calls
│   ├── courtService.js   # Court/Equipment/Coach APIs
│   └── adminService.js   # Admin APIs
├── utils/
│   └── formatters.js     # Date, currency formatters
├── App.jsx               # Main app with routing
└── main.jsx              # Entry point
```

## 🎯 Key Components

### Authentication Flow
1. User visits `/login` or `/register`
2. Credentials sent to backend API
3. JWT token stored in localStorage
4. Token attached to all API requests via interceptor
5. Protected routes check auth state

### Booking Flow
1. User selects court, date, time
2. Real-time availability check (court + coach + equipment)
3. Dynamic price calculation with breakdown
4. Shows applied pricing rules
5. Confirmation modal before booking
6. Atomic booking creation via API

### Price Calculation
The pricing component makes live API calls as user modifies:
- Court selection
- Date/time range
- Coach selection
- Equipment quantities

Price breakdown shows:
- Base price (court × duration)
- Applied rules (peak hours, weekend, indoor premium)
- Coach fee
- Equipment fee
- **Total with visual breakdown**

## 🔐 Authentication

Protected routes automatically redirect to login:
- `/booking` - Requires authentication
- `/my-bookings` - Requires authentication
- `/admin` - Requires admin role

Token is stored in localStorage and attached to requests via Axios interceptor.

## 🎨 Styling

Uses Tailwind CSS with custom utilities:

```css
.btn-primary    /* Primary action buttons */
.btn-secondary  /* Secondary buttons */
.input-field    /* Form inputs */
.card           /* Content cards */
```

Custom color palette based on blue primary color with shades 50-950.

## 📱 Responsive Design

Breakpoints:
- `sm`: 640px (Mobile landscape)
- `md`: 768px (Tablets)
- `lg`: 1024px (Desktop)
- `xl`: 1280px (Large desktop)

Mobile-first approach with hamburger menu on small screens.

### Testing Flow

1. **Register/Login**
   - Test both registration and login
   - Verify token storage
   - Check navbar updates

2. **Make a Booking**
   - Select court and time
   - Verify availability check
   - Add coach and equipment
   - Check price calculation
   - Confirm booking

3. **View Bookings**
   - Check "My Bookings" page
   - Test filter buttons
   - Cancel a future booking

4. **Admin Features** (login as admin)
   - Navigate to Admin dashboard
   - Switch between tabs
   - Create/edit courts
   - Manage equipment
   - Configure pricing rules

## 🔧 Configuration

### API URL
Configure backend URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Proxy Setup
Vite proxy configured in `vite.config.js` for local development:
```javascript
proxy: {
  '/api': 'http://localhost:5000'
}
```

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Output in `dist/` directory.

## 🚀 Deployment

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

Add environment variable:
```
VITE_API_URL=https://your-backend-api.com/api
```

### Vercel
```bash
# Auto-detected, just connect repository
# Set environment variable in dashboard
```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to web server
```

## 🐛 Common Issues

**API Connection Failed**
- Check if backend is running on port 5000
- Verify VITE_API_URL in .env
- Check browser console for CORS errors

**Token Expired**
- Tokens expire after 30 days
- Re-login to get new token
- Check localStorage in DevTools

**Styles Not Loading**
- Run `npm install` again
- Clear browser cache
- Check if Tailwind is configured properly

**Build Errors**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check for TypeScript errors if any

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    600: '#your-color',
  }
}
```
## 🔮 Future Enhancements

- [ ] Add loading skeletons
- [ ] Implement toast notifications
- [ ] Add booking calendar view
- [ ] Enable recurring bookings
- [ ] Add user profile page
- [ ] Implement dark mode
- [ ] Add animations with Framer Motion
- [ ] Progressive Web App (PWA)
- [ ] Email verification
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

---
