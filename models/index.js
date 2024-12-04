const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

// Import all models
const Auth = require("./Auth");
const Post = require("./Post");
const Profile = require("./Profile");

Auth.hasMany(Post, { foreignKey: "userId", as: "posts" });
Auth.hasOne(Profile, { foreignKey: "userId", as: "profile" }); // One-to-one relationship with profile

Post.belongsTo(Auth, { foreignKey: "userId", as: "author" });  // Post's author (Auth)
Post.belongsTo(Profile, { foreignKey: "userId", as: "authorProfile" });  // Author's profile

Profile.belongsTo(Auth, { foreignKey: "userId", as: "user" });  // Profile owner (Auth user)
Profile.hasMany(Post, { foreignKey: "userId" });  // A profile can have many posts
Profile.belongsTo(Auth, { foreignKey: "userId", as: "profileOwner" });  // To ensure it's tied to the Auth user

module.exports = {
    sequelize,
    Auth,
    Profile,
    Post,
};
