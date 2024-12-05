const { Auth, Profile, Post } = require("../models");
const { Op } = require("sequelize");

const getProfileData = async (req, res) => {
    try {
        const authId = req.auth.id;

        const profile = await Profile.findOne({
            where: { userId: authId },
            attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
            include: [
                {
                model: Auth,
                as: "user",
                attributes: ["username", "email"],
                },
            ],
        });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
};

const getProfile = async (req, res) => {
    try {
        const authId = req.auth.id; 

        const profile = await Profile.findOne({
            where: { userId: authId },
            attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
                include: [
                    {
                        model: Auth,
                        as: "user", 
                        attributes: ["username", "email"], 
                    },
                ],
        });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const posts = await Post.findAll({
            where: { userId: authId },
            attributes: ["id", "caption", "content", "createdAt"],
            order: [["createdAt", "DESC"]], // Optional: order posts by latest
        });

        res.json({ profile, posts });
    } catch (error) {
        console.error("Error fetching user profile with posts:", error);
        res.status(500).json({ error: "Failed to fetch user profile with posts" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const authId = req.auth.id; 
        const { username, fullName, bio, career } = req.body;
        const profilePhoto = req.file?.filename; 

        const auth = await Auth.findByPk(authId);

        if (!auth) {
            return res.status(404).json({ error: "User not found" });
        }

        if (username && username !== auth.username) {
            const existingUser = await Auth.findOne({ where: { username } });

            if (existingUser) {
                return res.status(409).json({ error: "Username is already taken" });
            }
        }

        auth.username = username || auth.username;
        await auth.save();

        const profile = await Profile.findOne({ where: { userId: authId } });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Update the profile data
        profile.fullName = fullName || profile.fullName;
        profile.bio = bio || profile.bio;
        profile.career = career || profile.career;
        if (profilePhoto) profile.profilePhoto = profilePhoto; 

        await profile.save();

        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const existingUser = await Auth.findOne({ where: { username } });

        console.log(existingUser);

        if (existingUser) {
            return res.status(200).json({ available: false });
        } else {
            res.status(200).json({ available: true });   
        }
    } catch (error) {
        console.error("Error checking username availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params; 
        
        const authUser = await Auth.findOne({
            where: { username },
            attributes: ['id']
        });

        const userId = authUser.id;

        if (!authUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = await Profile.findOne({
            where: { userId: userId },
            attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
                include: [
                    {
                        model: Auth,
                        as: "user", 
                        attributes: ["username"],
                    },
                ],
            });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const posts = await Post.findAll({
            where: { userId: userId },
            attributes: ["id", "caption", "content", "createdAt"],
            order: [["createdAt", "DESC"]], 
        });

        res.json({ profile, posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const searchProfile = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const users = await Auth.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${username}%`, 
                },
            },
            attributes: ['username'],
            include: [
                {
                    model: Profile, 
                    as: 'profile', 
                    attributes: ['profilePhoto'],
                },
            ],
            limit: 20, 
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const formattedUsers = users.map((user) => ({
            username: user.username,
            profilePhoto: user.profile?.profilePhoto || null, 
        }));

        return res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error searching profiles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Exporting controller functions
module.exports = {
    getProfileData,
    getProfile,
    updateProfile,
    checkUsernameAvailability,
    getPublicProfile,
    searchProfile
};
