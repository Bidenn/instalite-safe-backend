const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

// Import all models
const Auth = require("./Auth");
const Post = require("./Post");
const Like = require("./Like");
const Mutual = require("./Mutual");
const Comment = require("./Comment");
const Profile = require("./Profile");

// 1. Auth Model Associations
// An Auth user can have many posts, likes, comments, and followings
Auth.hasMany(Post, { foreignKey: "userId", as: "posts" });
Auth.hasMany(Like, { foreignKey: "userId", as: "likes" });
Auth.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Auth.hasMany(Mutual, { foreignKey: "userId", as: "followings" });  // Who this user follows
Auth.hasMany(Mutual, { foreignKey: "followingId", as: "followers" });  // Who follows this user
Auth.hasOne(Profile, { foreignKey: "userId", as: "profile" }); // One-to-one relationship with profile

// 2. Post Model Associations
// A Post belongs to one Auth user (the author) and can have many likes and comments
Post.belongsTo(Auth, { foreignKey: "userId", as: "author" });  // Post's author (Auth)
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });  // Likes for this post
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });  // Comments for this post
Post.belongsTo(Profile, { foreignKey: "userId", as: "authorProfile" });  // Author's profile

// 3. Like Model Associations
// A Like belongs to one Post and one Auth user
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });
Like.belongsTo(Auth, { foreignKey: "userId", as: "user" });

// 4. Mutual (Follow/Followers) Model Associations
// A Mutual relationship defines following and followed users
Mutual.belongsTo(Auth, { foreignKey: "userId", as: "followedUser" });  // The followed user
Mutual.belongsTo(Auth, { foreignKey: "followingId", as: "followingUser" });  // The following user

// 5. Comment Model Associations
// A Comment belongs to one Auth user (the author) and one Post
Comment.belongsTo(Auth, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Comment.belongsTo(Profile, { foreignKey: "userId", as: "authorProfile" });  // Author's profile

// 6. Profile Model Associations
// A Profile belongs to one Auth user and can have many posts, likes, and comments
Profile.belongsTo(Auth, { foreignKey: "userId", as: "user" });  // Profile owner (Auth user)
Profile.hasMany(Post, { foreignKey: "userId" });  // A profile can have many posts
Profile.hasMany(Like, { foreignKey: "userId", as: "profileLikes" });  // Likes from this profile
Profile.hasMany(Comment, { foreignKey: "userId", as: "profileComments" });  // Comments from this profile

// Two associations for Profile (hasMany and belongsTo) to handle its relationship to Auth and Post
Profile.belongsTo(Auth, { foreignKey: "userId", as: "profileOwner" });  // To ensure it's tied to the Auth user

// Export all models and Sequelize instance for use in other parts of the application
module.exports = {
    sequelize,
    Auth,
    Profile,
    Post,
    Like,
    Comment,
    Mutual,
};
