const { Auth, Profile, Post } = require('../models');

const getHomepageData = async (req, res) => {
    try {
        const authId = req.auth.id; 

        const loggedUser = await Auth.findByPk(authId, {
            attributes: ['username'],
        });

        if (!loggedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const loggedUserProfile = await Profile.findOne({
            where: { userId: authId },
            attributes: ['profilePhoto'],
        });

        const posts = await Post.findAll({
            include: [
                {
                    model: Auth,
                    as: 'author', 
                    attributes: ['username'],
                },
                {
                    model: Profile,
                    as: 'authorProfile',
                    attributes: ['profilePhoto'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const response = {
            loggedUser: {
                username: loggedUser.username,
                profilePhoto: loggedUserProfile ? loggedUserProfile.profilePhoto : null,
            },
            posts: posts.map(post => ({
                id: post.id,
                caption: post.caption,
                content: post.content,
                createdAt: post.createdAt,
                username: post.author.username,
                profilePhoto: post.authorProfile ? post.authorProfile.profilePhoto : null, // Fetch the profile photo of the author
            })),
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.status(500).json({ error: 'Failed to fetch homepage data' });
    }
};

module.exports = {
    getHomepageData,
};
