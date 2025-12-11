const sequelize = require('../config/database');
const User = require('../models/User');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Disable foreign key checks to allow dropping tables
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Sync all models with force (drop and recreate)
        await sequelize.sync({ force: true });
        console.log('All models synchronized.');
        
        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@sportsclub.com',
            password: 'admin123',
            phone: '1234567890',
            role: 'admin'
        });
        console.log('Admin user created.');

        // Create regular users
        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            phone: '9876543210',
            role: 'user'
        });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'user123',
            phone: '9876543211',
            role: 'user'
        });
        console.log('Regular users created.');

        // Create courts
        const court1 = await Court.create({
            name: 'Indoor Court 1',
            type: 'indoor',
            basePrice: 15.00,
            description: 'Premium indoor badminton court with AC'
        });

        const court2 = await Court.create({
            name: 'Indoor Court 2',
            type: 'indoor',
            basePrice: 15.00,
            description: 'Premium indoor badminton court with AC'
        });

        const court3 = await Court.create({
            name: 'Outdoor Court 1',
            type: 'outdoor',
            basePrice: 10.00,
            description: 'Standard outdoor badminton court'
        });

        const court4 = await Court.create({
            name: 'Outdoor Court 2',
            type: 'outdoor',
            basePrice: 10.00,
            description: 'Standard outdoor badminton court'
        });
        console.log('Courts created.');

        // Create equipment
        const rackets = await Equipment.create({
            name: 'Badminton Racket',
            type: 'racket',
            totalQuantity: 20,
            pricePerUnit: 3.00,
            description: 'Professional badminton rackets'
        });

        const shoes = await Equipment.create({
            name: 'Sports Shoes',
            type: 'shoes',
            totalQuantity: 15,
            pricePerUnit: 4.00,
            description: 'Non-marking badminton shoes'
        });

        const shuttlecocks = await Equipment.create({
            name: 'Shuttlecocks (Set of 6)',
            type: 'other',
            totalQuantity: 50,
            pricePerUnit: 2.00,
            description: 'Feather shuttlecocks'
        });
        console.log('Equipment created.');

        // Create coaches
        const coach1 = await Coach.create({
            name: 'Coach Mike Johnson',
            email: 'mike@sportsclub.com',
            phone: '5551234567',
            specialization: 'Beginner Training',
            pricePerHour: 20.00,
            availability: {
                monday: [{ start: '09:00', end: '17:00' }],
                tuesday: [{ start: '09:00', end: '17:00' }],
                wednesday: [{ start: '09:00', end: '17:00' }],
                thursday: [{ start: '09:00', end: '17:00' }],
                friday: [{ start: '09:00', end: '17:00' }],
                saturday: [{ start: '10:00', end: '16:00' }]
            },
            bio: 'Certified badminton coach with 5 years of experience'
        });

        const coach2 = await Coach.create({
            name: 'Coach Sarah Williams',
            email: 'sarah@sportsclub.com',
            phone: '5551234568',
            specialization: 'Advanced Training',
            pricePerHour: 30.00,
            availability: {
                monday: [{ start: '10:00', end: '18:00' }],
                tuesday: [{ start: '10:00', end: '18:00' }],
                wednesday: [{ start: '10:00', end: '18:00' }],
                thursday: [{ start: '10:00', end: '18:00' }],
                friday: [{ start: '10:00', end: '18:00' }],
                sunday: [{ start: '09:00', end: '13:00' }]
            },
            bio: 'Professional badminton coach, former national player'
        });

        const coach3 = await Coach.create({
            name: 'Coach David Lee',
            email: 'david@sportsclub.com',
            phone: '5551234569',
            specialization: 'Kids Training',
            pricePerHour: 18.00,
            availability: {
                monday: [{ start: '14:00', end: '20:00' }],
                wednesday: [{ start: '14:00', end: '20:00' }],
                friday: [{ start: '14:00', end: '20:00' }],
                saturday: [{ start: '09:00', end: '17:00' }],
                sunday: [{ start: '09:00', end: '17:00' }]
            },
            bio: 'Specialized in coaching children and teenagers'
        });
        console.log('Coaches created.');

        // Create pricing rules
        const peakHourRule = await PricingRule.create({
            name: 'Peak Hour Premium',
            ruleType: 'peak_hour',
            multiplier: 1.5,
            conditions: {
                startTime: '18:00',
                endTime: '21:00'
            },
            priority: 1,
            description: 'Higher rates during peak hours (6 PM - 9 PM)'
        });

        const weekendRule = await PricingRule.create({
            name: 'Weekend Surcharge',
            ruleType: 'weekend',
            fixedAmount: 5.00,
            priority: 2,
            description: 'Additional charge on weekends'
        });

        const indoorPremiumRule = await PricingRule.create({
            name: 'Indoor Court Premium',
            ruleType: 'indoor_premium',
            multiplier: 1.2,
            priority: 3,
            description: 'Premium pricing for indoor courts'
        });

        const morningDiscountRule = await PricingRule.create({
            name: 'Morning Discount',
            ruleType: 'custom',
            multiplier: 0.8,
            conditions: {
                startTime: '06:00',
                endTime: '10:00',
                days: [1, 2, 3, 4, 5] // Monday to Friday
            },
            priority: 4,
            isActive: true,
            description: 'Discounted rates for morning slots on weekdays'
        });

        console.log('Pricing rules created.');

        console.log('\n========================================');
        console.log('Database seeding completed successfully!');
        console.log('========================================\n');
        console.log('Admin Credentials:');
        console.log('Email: admin@sportsclub.com');
        console.log('Password: admin123\n');
        console.log('Test User Credentials:');
        console.log('Email: john@example.com');
        console.log('Password: user123\n');
        console.log('Email: jane@example.com');
        console.log('Password: user123\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();