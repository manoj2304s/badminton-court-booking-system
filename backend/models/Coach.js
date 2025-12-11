const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coach = sequelize.define('Coach', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    specialization: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    pricePerHour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 20.00
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    availability: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON structure: {monday: [{start: "09:00", end: "17:00"}], ...}'
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'coaches'
});

module.exports = Coach;