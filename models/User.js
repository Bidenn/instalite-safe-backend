const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  fullName: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  profilePhoto: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  career: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  aboutMe: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  sessionId: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
});

module.exports = User;
