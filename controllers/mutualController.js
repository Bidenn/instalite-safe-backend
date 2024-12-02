const { Mutual, Auth } = require('../models');

const followUser = async (req, res) => {
    try {
        const userId = req.auth.id; // User yang ingin mengikuti
        const { followingId } = req.body; // User yang akan diikuti

        if (!followingId) {
            return res.status(400).json({ error: 'ID pengguna yang akan diikuti diperlukan' });
        }

        if (userId === followingId) {
            return res.status(400).json({ error: 'Anda tidak dapat mengikuti diri sendiri' });
        }

        // Pastikan pengguna yang akan diikuti ada
        const userToFollow = await Auth.findByPk(followingId);

        if (!userToFollow) {
            return res.status(404).json({ error: 'Pengguna yang ingin diikuti tidak ditemukan' });
        }

        // Cek apakah sudah mengikuti
        const alreadyFollowing = await Mutual.findOne({ where: { userId, followingId } });

        if (alreadyFollowing) {
            return res.status(400).json({ error: 'Anda sudah mengikuti pengguna ini' });
        }

        // Tambahkan data mengikuti
        await Mutual.create({ userId, followingId });

        res.status(201).json({ message: 'Berhasil mengikuti pengguna' });
    } catch (error) {
        console.error('Error saat mengikuti pengguna:', error);
        res.status(500).json({ error: 'Gagal mengikuti pengguna' });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const userId = req.auth.id; // User yang ingin berhenti mengikuti
        const { followingId } = req.body; // User yang akan berhenti diikuti

        if (!followingId) {
            return res.status(400).json({ error: 'ID pengguna yang akan berhenti diikuti diperlukan' });
        }

        // Cek apakah pengguna sudah diikuti
        const followRelation = await Mutual.findOne({ where: { userId, followingId } });

        if (!followRelation) {
            return res.status(404).json({ error: 'Anda tidak mengikuti pengguna ini' });
        }

        // Hapus relasi mengikuti
        await followRelation.destroy();

        res.status(200).json({ message: 'Berhasil berhenti mengikuti pengguna' });
    } catch (error) {
        console.error('Error saat berhenti mengikuti pengguna:', error);
        res.status(500).json({ error: 'Gagal berhenti mengikuti pengguna' });
    }
};

const viewFollowing = async (req, res) => {
    try {
        const userId = req.auth.id; // ID pengguna yang sedang login

        // Temukan semua pengguna yang diikuti
        const following = await Mutual.findAll({
            where: { userId },
            include: [{ model: Auth, as: 'followingUser', attributes: ['id', 'username', 'email'] }],
        });

        res.status(200).json(following);
    } catch (error) {
        console.error('Error saat melihat daftar yang diikuti:', error);
        res.status(500).json({ error: 'Gagal melihat daftar yang diikuti' });
    }
};


const viewFollowers = async (req, res) => {
    try {
        const userId = req.auth.id; // ID pengguna yang sedang login

        // Temukan semua pengikut
        const followers = await Mutual.findAll({
            where: { followingId: userId },
            include: [{ model: Auth, as: 'followerUser', attributes: ['id', 'username', 'email'] }],
        });

        res.status(200).json(followers);
    } catch (error) {
        console.error('Error saat melihat daftar pengikut:', error);
        res.status(500).json({ error: 'Gagal melihat daftar pengikut' });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    viewFollowing,
    viewFollowers,
};

