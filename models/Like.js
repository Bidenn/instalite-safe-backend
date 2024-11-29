const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Like = sequelize.define('Like', {
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false, // A like must be associated with a post
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // A like must be associated with a user
    },
}, {
    tableName: 'Likes', // Explicit table name
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

module.exports = Like;
