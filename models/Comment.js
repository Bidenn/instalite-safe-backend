const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false, // A comment must be associated with a post
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false, // A comment cannot be empty
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // A comment must be associated with a user
    },
}, {
    tableName: 'Comments', // Explicit table name
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

module.exports = Comment;
