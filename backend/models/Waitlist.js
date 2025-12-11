const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Court = require('./Court');

const Waitlist = sequelize.define('Waitlist', {
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
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('waiting', 'notified', 'expired'),
        defaultValue: 'waiting'
    },
    requestedResources: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Requested coach and equipment'
    },
    notifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'waitlist',
    indexes: [
        {
            fields: ['court_id', 'start_time', 'status']
        }
    ]
});

// Associations
Waitlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Waitlist.belongsTo(Court, { foreignKey: 'courtId', as: 'court' });

module.exports = Waitlist;