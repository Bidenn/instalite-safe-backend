const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Mutual = sequelize.define('Mutual', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // The user who is performing the follow
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false, // The user being followed
    },
}, {
    tableName: 'Mutuals', // Explicit table name
    timestamps: true, // Adds `createdAt` and `updatedAt` columns
});

module.exports = Mutual;
