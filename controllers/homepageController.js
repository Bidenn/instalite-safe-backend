const { Auth, Profile, Post, Mutual } = require('../models');

// Fetch homepage data for the logged-in user
const getHomepageData = async (req, res) => {
    try {
        const authId = req.auth.id; // The logged-in user

        // Fetch logged-in user data (username, profilePhoto)
        const loggedUser = await Auth.findByPk(authId, {
            attributes: ['username'],
            include: [
                {
                    model: Profile,
                    attributes: ['profilePhoto'], // Profile photo of the logged-in user
                },
            ],
        });

        if (!loggedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch mutual friends of the logged-in user (users who are following each other)
        const mutualFriends = await Mutual.findAll({
            where: {
                [Op.or]: [
                    { followerId: authId },
                    { followedId: authId },
                ],
                mutualStatus: 'accepted',
            },
            include: [
                {
                    model: Auth,
                    as: 'follower', // Get follower details
                    attributes: ['username'],
                    include: [
                        {
                            model: Profile,
                            attributes: ['profilePhoto'], // Profile photo of the follower
                        },
                    ],
                },
                {
                    model: Auth,
                    as: 'followed', // Get followed details
                    attributes: ['username'],
                    include: [
                        {
                            model: Profile,
                            attributes: ['profilePhoto'], // Profile photo of the followed user
                        },
                    ],
                },
            ],
        });

        // Prepare mutual friends list (from both follower and followed)
        const mutualFriendsData = mutualFriends.map((mutual) => {
            const friend = mutual.followerId === authId ? mutual.followed : mutual.follower;
            return {
                username: friend.username,
                profilePhoto: friend.Profile ? friend.Profile.profilePhoto : null,
            };
        });

        // Fetch posts from logged-in user and mutual friends
        const postUserIds = [authId, ...mutualFriendsData.map(friend => friend.username)];
        const posts = await Post.findAll({
            where: {
                userId: {
                    [Op.in]: postUserIds,
                },
            },
            include: [
                {
                    model: Auth,
                    attributes: ['username'],
                },
                {
                    model: Profile,
                    attributes: ['profilePhoto'],
                },
            ],
            order: [['createdAt', 'DESC']], // Optional: order posts by latest
        });

        res.json({
            loggedUser: {
                username: loggedUser.username,
                profilePhoto: loggedUser.Profile ? loggedUser.Profile.profilePhoto : null,
            },
            mutualFriends: mutualFriendsData,
            posts: posts.map(post => ({
                id: post.id,
                caption: post.caption,
                content: post.content,
                createdAt: post.createdAt,
                username: post.Auth.username,
                profilePhoto: post.Profile ? post.Profile.profilePhoto : null,
            })),
        });
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.status(500).json({ error: 'Failed to fetch homepage data' });
    }
};

// Exporting controller functions
module.exports = {
    getHomepageData,
};
