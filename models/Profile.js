const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Profile = sequelize.define('Profile', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures one profile per user
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    profilePhoto: {
        type: DataTypes.STRING, // Assuming this stores a URL or file path
        allowNull: true,
    },
    career: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT, // For a longer bio
        allowNull: true,
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default is public profile
    },
}, {
    tableName: 'Profiles', // Explicit table name
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

module.exports = Profile;
