const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');

User.hasMany(Post, { foreignKey: "userId", as: "posts" });

Post.belongsTo(User, { foreignKey: "userId", as: "author" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" });
Post.hasMany(Like, { foreignKey: "postId", as: "likes", onDelete: "CASCADE" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
    sequelize,
    User,
    Post,
    Comment,
    Like,
};
