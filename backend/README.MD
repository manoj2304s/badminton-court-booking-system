# Sports Facility Court Booking Platform - Backend

A comprehensive REST API for managing sports facility bookings with multi-resource scheduling and dynamic pricing.

## 🎯 Features

- **Multi-Resource Booking**: Atomic transactions ensure all resources (court, equipment, coach) are booked together
- **Dynamic Pricing Engine**: Rule-based pricing system with stackable conditions
- **Availability Management**: Real-time checking across courts, coaches, and equipment
- **Waitlist System**: Automatic notification when slots become available
- **Admin Dashboard**: Complete resource and pricing rule management
- **Concurrent Booking Prevention**: Transaction-based locking prevents double bookings

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create MySQL database**
```sql
CREATE DATABASE sports_booking;
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
NODE_ENV=
```

5. **Seed the database**
```bash
npm run seed
```

6. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📊 Database Design

### Tables Overview

1. **users** - User accounts and authentication
2. **courts** - Badminton court information
3. **equipment** - Rental equipment inventory
4. **coaches** - Coach profiles and availability
5. **pricing_rules** - Dynamic pricing configurations
6. **bookings** - Court booking records
7. **waitlist** - Queue for fully-booked slots

### Key Design Decisions

**Multi-Resource Constraints:**
- Bookings use foreign keys to link courts, coaches, and equipment
- Equipment is stored as JSON array to handle variable quantities
- Overlapping time slots are prevented through query logic

**Pricing Flexibility:**
- Rules are stored in database, not hardcoded
- JSON conditions field allows complex rule definitions
- Priority system determines rule application order
- Both multiplier and fixed amount supported

**Concurrency Handling:**
- Database transactions ensure atomic operations
- Row-level locking during availability checks
- Sequelize's transaction API provides rollback on conflicts

## 🔌 API Endpoints

### Courts

#### Get All Courts
```http
GET /api/courts?type=indoor&isActive=true
```

#### Create Court (Admin)
```http
POST /api/courts
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Indoor Court 3",
  "type": "indoor",
  "basePrice": 15.00,
  "description": "Premium court"
}
```

### Equipment

#### Get All Equipment
```http
GET /api/equipment
```

#### Update Equipment (Admin)
```http
PUT /api/equipment/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "totalQuantity": 25,
  "pricePerUnit": 3.50
}
```

### Coaches

#### Get Available Coaches
```http
GET /api/coaches/available?startTime=2025-12-15T18:00:00&endTime=2025-12-15T19:00:00
```

#### Create Coach (Admin)
```http
POST /api/coaches
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Coach Alex",
  "pricePerHour": 25.00,
  "availability": {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}]
  }
}
```

### Pricing Rules

#### Get All Rules
```http
GET /api/pricing-rules?isActive=true
```

#### Create Pricing Rule (Admin)
```http
POST /api/pricing-rules
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Holiday Premium",
  "ruleType": "holiday",
  "multiplier": 1.8,
  "conditions": {
    "holidays": ["2025-12-25", "2026-01-01"]
  },
  "priority": 1,
  "description": "Higher rates on holidays"
}
```

### Bookings

#### Check Availability
```http
POST /api/bookings/check-availability
Content-Type: application/json

{
  "courtId": 1,
  "startTime": "2025-12-15T18:00:00",
  "endTime": "2025-12-15T19:00:00",
  "coachId": 2,
  "equipment": [
    {"equipmentId": 1, "quantity": 2}
  ]
}
```

#### Calculate Price
```http
POST /api/bookings/calculate-price
Content-Type: application/json

{
  "courtId": 1,
  "startTime": "2025-12-15T18:00:00",
  "endTime": "2025-12-15T19:00:00",
  "coachId": 2,
  "equipment": [
    {"equipmentId": 1, "quantity": 2}
  ]
}
```

Response:
```json
{
  "basePrice": "15.00",
  "appliedRules": [
    {
      "name": "Peak Hour Premium",
      "type": "peak_hour",
      "amount": "7.50"
    },
    {
      "name": "Indoor Court Premium",
      "type": "indoor_premium",
      "amount": "3.00"
    }
  ],
  "equipmentFee": "6.00",
  "coachFee": "20.00",
  "totalPrice": "51.50"
}
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "courtId": 1,
  "startTime": "2025-12-15T18:00:00",
  "endTime": "2025-12-15T19:00:00",
  "coachId": 2,
  "equipment": [
    {"equipmentId": 1, "quantity": 2}
  ],
  "notes": "First time booking"
}
```

#### Get Available Slots
```http
GET /api/bookings/available-slots?courtId=1&date=2025-12-15
```

#### Get User Bookings
```http
GET /api/bookings/user/my-bookings?status=confirmed
Authorization: Bearer <user_token>
```

#### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer <user_token>
```

#### Join Waitlist
```http
POST /api/bookings/:id/waitlist
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "courtId": 1,
  "startTime": "2025-12-15T18:00:00",
  "endTime": "2025-12-15T19:00:00"
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

Token is returned upon successful login/registration.

### Admin Routes

Admin-only routes (marked with `adminAuth` middleware):
- All POST/PUT/DELETE for courts, equipment, coaches, pricing rules
- View all bookings

## 💰 Pricing Engine

### How It Works

1. **Base Price**: Starts with court's base price × duration
2. **Apply Rules**: Active rules are applied based on priority
3. **Stackable Rules**: Multiple rules can apply simultaneously
4. **Add Resources**: Coach and equipment fees added to total

### Rule Types

- `peak_hour`: Time-based multiplier (e.g., 6-9 PM)
- `weekend`: Fixed surcharge on weekends
- `indoor_premium`: Multiplier for indoor courts
- `holiday`: Special pricing on specific dates
- `custom`: User-defined conditions

### Example Calculation

```
Indoor Court (Base: $15/hr)
+ Indoor Premium (×1.2) = $18
+ Peak Hour (×1.5) = $27
+ Weekend Surcharge (+$5) = $32
+ Coach ($20/hr) = $52
+ 2 Rackets ($3 each) = $58
─────────────────────────
Total: $58.00
```

## 🔒 Concurrent Booking Prevention

The system prevents double bookings using:

1. **Database Transactions**: All booking operations wrapped in transactions
2. **Overlap Detection**: Query checks for time conflicts across all resources
3. **Atomic Operations**: Either all resources book together or none do
4. **Row Locking**: Sequelize transactions with isolation levels

Example flow:
```javascript
BEGIN TRANSACTION
  → Check court availability
  → Check coach availability  
  → Check equipment availability
  → If all available: CREATE booking
  → If any unavailable: ROLLBACK
COMMIT TRANSACTION
```

## 📝 Seed Data

After running `npm run seed`, the database includes:

**Users:**
- Admin account included in seed data
- Sample user accounts included in seed data

**Courts:**
- 2 Indoor courts ($15/hr)
- 2 Outdoor courts ($10/hr)

**Equipment:**
- 20 Rackets ($3/hr each)
- 15 Shoes ($4/hr each)
- 50 Shuttlecock sets ($2/hr each)

**Coaches:**
- Coach Mike (Beginner, $20/hr)
- Coach Sarah (Advanced, $30/hr)
- Coach David (Kids, $18/hr)

**Pricing Rules:**
- Peak Hour Premium (6-9 PM, ×1.5)
- Weekend Surcharge (+$5)
- Indoor Premium (×1.2)
- Morning Discount (6-10 AM weekdays, ×0.8)

## 🧪 Testing

Use Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health
```

## 🐛 Common Issues

**Database Connection Failed**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

**Token Invalid**
- Token expires after 30 days
- Re-login to get new token
- Check Authorization header format

**Booking Conflicts**
- Check resource availability first
- Verify time format (ISO 8601)
- Ensure resources are active

## 📈 Future Enhancements

- [ ] Email notifications for bookings
- [ ] SMS alerts for waitlist
- [ ] Payment gateway integration
- [ ] Recurring bookings
- [ ] Mobile app API extensions
- [ ] Analytics dashboard
- [ ] Review and rating system

## 👥 Contributors

Name: Manoj S

---
