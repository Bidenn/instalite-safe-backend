const { Auth, Profile, Post } = require("../models");
const { Op } = require("sequelize");

// Fetch user profile data for editing purpose
const getProfileData = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware

        // Fetch profile data associated with the user
        const profile = await Profile.findOne({
        where: { userId: authId },
        attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
        include: [
            {
            model: Auth,
            as: "user", // Match the alias in the association
            attributes: ["username", "email"], // Include username and email from Auth model
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

// Fetch user profile data for profile page
const getProfile = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        // Fetch profile data associated with the user
        const profile = await Profile.findOne({
        where: { userId: authId },
        attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
            include: [
            {
                model: Auth,
                as: "user", // Match the alias in the association
                attributes: ["username", "email"], // Include username and email from Auth model
            },
            ],
        });

        if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
        }

        // Fetch posts associated with the user
        const posts = await Post.findAll({
            where: { userId: authId },
            attributes: ["id", "caption", "content", "createdAt"],
            order: [["createdAt", "DESC"]], // Optional: order posts by latest
        });

        res.json({
            profile, // Include profile data
            posts, // Include posts associated with the user
        });
    } catch (error) {
        console.error("Error fetching user profile with posts:", error);
        res.status(500).json({ error: "Failed to fetch user profile with posts" });
    }
};

// Update user profile data
const updateProfile = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        const { username, fullName, bio, career } = req.body;
        const profilePhoto = req.file?.filename; // Image uploaded via Multer (if applicable)

        console.log(req.body);

        // Fetch the Auth user data (authentication-related)
        const auth = await Auth.findByPk(authId);

        if (!auth) {
        return res.status(404).json({ error: "User not found" });
        }

        // Check if username is already taken (by another user)
        if (username && username !== auth.username) {
        const existingUser = await Auth.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: "Username is already taken" });
        }
        }

        // Update user authentication data (username only here)
        auth.username = username || auth.username;
        await auth.save();

        // Fetch the user's profile data
        const profile = await Profile.findOne({ where: { userId: authId } });

        if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
        }

        // Update the profile data
        profile.fullName = fullName || profile.fullName;
        profile.bio = bio || profile.bio;
        profile.career = career || profile.career;
        if (profilePhoto) profile.profilePhoto = profilePhoto; // Update profile photo if provided
        await profile.save();

        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// Check if the username is available
const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
        return res.status(400).json({ error: "Username is required" });
        }

        const existingUser = await Auth.findOne({ where: { username } });

        if (existingUser) {
        return res.status(409).json({ available: false });
        }

        res.status(200).json({ available: true });
    } catch (error) {
        console.error("Error checking username availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch Another User Profile
const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params; // Fetch username from the route parameter
        
        // Fetch the userId from the Auth model based on the provided username
        const authUser = await Auth.findOne({
            where: { username },
            attributes: ['id'] // Select the necessary attributes
        });

        const userId = authUser.id;

        if (!authUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the profile data using the userId from Auth model
        const profile = await Profile.findOne({
            where: { userId: userId },
            attributes: ["userId", "fullName", "profilePhoto", "bio", "career"],
                include: [
                {
                    model: Auth,
                    as: "user", // Match the alias in the association
                    attributes: ["username"], // Include username and email from Auth model
                },
                ],
            });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Fetch posts associated with the user
        const posts = await Post.findAll({
            where: { userId: userId },
            attributes: ["id", "caption", "content", "createdAt"],
            order: [["createdAt", "DESC"]], // Optional: order posts by latest
        });

        // Respond with the profile and posts
        res.json({
            profile, // Include profile data
            posts, // Include posts associated with the user
        });
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

        // Search for users matching the username, including profile photo
        const users = await Auth.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${username}%`, // Case-insensitive partial match
                },
            },
            attributes: ['username'], // Only fetch username from Auth
            include: [
                {
                    model: Profile, // Include the Profile model
                    as: 'profile', // Use the alias defined in your associations
                    attributes: ['profilePhoto'], // Only fetch profilePhoto from Profile
                },
            ],
            limit: 10, // Limit results for performance
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Format the response
        const formattedUsers = users.map((user) => ({
            username: user.username,
            profilePhoto: user.profile?.profilePhoto || null, // Handle null profile photos
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
