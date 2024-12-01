const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

// Import all models
const Auth = require("./Auth");
const Profile = require("./Profile");
const Post = require("./Post");
const Like = require("./Like");
const Comment = require("./Comment");
const Mutual = require("./Mutual");

// Define Associations

// 1. Auth -> Profile (One-to-One)
Auth.hasOne(Profile, { foreignKey: "userId", as: "profile" });
Profile.belongsTo(Auth, { foreignKey: "userId", as: "user" });

// 2. Auth -> Post (One-to-Many)
// Auth.hasMany(Post, { foreignKey: "userId", as: "posts" });
// Post.belongsTo(Auth, { foreignKey: "userId", as: "author" });

// 3. Post -> Like (One-to-Many)
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });

// 4. Post -> Comment (One-to-Many)
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

// 5. Auth -> Like (One-to-Many)
Auth.hasMany(Like, { foreignKey: "userId", as: "likes" });
Like.belongsTo(Auth, { foreignKey: "userId", as: "user" });

// 6. Auth -> Comment (One-to-Many)
Auth.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(Auth, { foreignKey: "userId", as: "user" });

// 7. Mutuals (Self-referencing for Following/Followers)
Auth.hasMany(Mutual, { foreignKey: "userId", as: "followings" }); // Who this user follows
Auth.hasMany(Mutual, { foreignKey: "followingId", as: "followers" }); // Who follows this user
Mutual.belongsTo(Auth, { foreignKey: "userId", as: "followedUser" });
Mutual.belongsTo(Auth, { foreignKey: "followingId", as: "followingUser" });

// 8. Profile -> Posts, Likes, Comments (Optional Extended Associations)
// Profile.hasMany(Post, { foreignKey: "userId", as: "profilePosts" });
Profile.hasMany(Like, { foreignKey: "userId", as: "profileLikes" });
Profile.hasMany(Comment, { foreignKey: "userId", as: "profileComments" });

// Sync or Export models and Sequelize instance
module.exports = {
  sequelize,
  Auth,
  Profile,
  Post,
  Like,
  Comment,
  Mutual,
};
