const Post = require('../models/Post');
const User = require('../models/User');
const { authenticateJWT } = require('../middlewares/authenticateJWT'); // To verify the token

// Homepage route to get all posts along with logged-in user's data
exports.homepage = [
  authenticateJWT, // Middleware to verify token and get logged-in user data
  async (req, res) => {
    try {
      // Extract logged-in user data from the token payload (provided by authenticateJWT middleware)
      const loggedUserId = req.user.id;

      // Fetch the logged-in user data from the database
      const loggedUser = await User.findByPk(loggedUserId, {
        attributes: ['id', 'username', 'profilePhoto'], // Fetch relevant user details
      });

      if (!loggedUser) {
        return res.status(404).json({ error: 'Logged-in user not found' });
      }

      // Fetch all posts along with their associated user data
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'user', // The alias defined in the association
            attributes: ['id', 'username', 'profilePhoto'], // Include user details
          },
        ],
        order: [['createdAt', 'DESC']], // Order posts by creation date (newest first)
      });

      // Send the posts and logged-in user data as a response
      res.json({
        message: 'Posts and logged-in user data retrieved successfully',
        posts: posts || [], // Ensure posts is always an array, even if null
        loggedUser,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    }
  },
];
