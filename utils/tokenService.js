const crypto = require('crypto');

const encryptToken = (token, password) => {
    const iv = crypto.randomBytes(12); // Random 12-byte IV
    const key = crypto.scryptSync(password, 'salt', 32); // Derive a 256-bit key

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(token, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    return {
        encryptedToken: encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
    };
};

const decryptToken = (encryptedToken, iv, authTag, password) => {
    const key = crypto.scryptSync(password, 'salt', 32); // Derive the same key
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(encryptedToken, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports = { encryptToken, decryptToken };
