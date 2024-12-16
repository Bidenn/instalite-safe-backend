const { User, Post } = require('../models');

const getHomepageData = async (req, res) => {
    try {
        const authId = req.auth.id; 

        const loggedUser = await User.findByPk(authId);

        if (!loggedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: 'author', 
                    attributes: ['username', 'photo'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const response = {
            loggedUser: {
                username: loggedUser.username,
                profilePhoto: loggedUser.photo,
            },
            posts: posts.map(post => ({
                id: post.id,
                caption: post.caption,
                content: post.content,
                createdAt: post.createdAt,
                username: post.author.username,
                photo: post.author.photo ? post.author.photo : null, 
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
