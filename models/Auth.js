const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Auth = sequelize.define('Auth', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures email is unique
        validate: {
            isEmail: true, // Ensures it's a valid email format
        },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true, // Username can be null
        unique: true, // Ensures username is unique if provided
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Password is required
    },
});

module.exports = Auth;
