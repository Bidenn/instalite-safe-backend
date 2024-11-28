// models/Post.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Your Sequelize instance
const User = require('./User'); // Import the User model for association

const Post = sequelize.define('Post', {
  content: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  caption: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: User,       // Reference the User model
      key: 'id',         // Foreign key reference to User's 'id'
    },
  },
});

// Define the association between Post and User
Post.belongsTo(User, {
  foreignKey: 'userId',  // Foreign key in Post model
  as: 'user',            // Alias for easy inclusion in queries
});

module.exports = Post;
