const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Post = sequelize.define('Post', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false, // Posts must have content
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: true, // Caption is optional
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Posts must be associated with a user
    },
}, {
    tableName: 'Posts', // Explicit table name
    timestamps: true, // Adds `createdAt` and `updatedAt` columns
});

module.exports = Post;
