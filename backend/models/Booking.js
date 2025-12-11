const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Court = require('./Court');
const Coach = require('./Coach');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    courtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'courts',
            key: 'id'
        }
    },
    coachId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'coaches',
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
        defaultValue: 'confirmed'
    },
    equipment: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of {equipmentId, quantity, pricePerUnit}'
    },
    pricingBreakdown: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Object with basePrice, appliedRules, equipmentFee, coachFee, totalPrice'
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'bookings',
    indexes: [
        {
            fields: ['court_id', 'start_time', 'end_time']
        },
        {
            fields: ['coach_id', 'start_time', 'end_time']
        },
        {
            fields: ['user_id']
        }
    ]
});

// Associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Court, { foreignKey: 'courtId', as: 'court' });
Booking.belongsTo(Coach, { foreignKey: 'coachId', as: 'coach' });

User.hasMany(Booking, { foreignKey: 'userId' });
Court.hasMany(Booking, { foreignKey: 'courtId' });
Coach.hasMany(Booking, { foreignKey: 'coachId' });

module.exports = Booking;