const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingRule = sequelize.define('PricingRule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ruleType: {
        type: DataTypes.ENUM('peak_hour', 'weekend', 'indoor_premium', 'holiday', 'custom'),
        allowNull: false
    },
    multiplier: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Multiplier for percentage-based rules (e.g., 1.5 for 50% increase)'
    },
    fixedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Fixed amount to add/subtract'
    },
    conditions: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON structure for rule conditions: {startTime: "18:00", endTime: "21:00", days: [0,6]}'
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Higher priority rules are applied first'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'pricing_rules'
});

module.exports = PricingRule;