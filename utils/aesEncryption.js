const CryptoJS = require('crypto-js');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const IV_KEY = process.env.IV_KEY || '';

if (Buffer.from(ENCRYPTION_KEY, 'base64').length !== 32) {
    throw new Error('Invalid ENCRYPTION_KEY: Must be 32 bytes (Base64 encoded)');
}

const encryptor = (text) => {
    if (!text) throw new Error('No text provided for encryption');
    
    const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY); // Parse key
    const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv }); // Encrypt

    // Combine encrypted text and IV, Base64 encoded
    return `${encrypted.toString()}:${CryptoJS.enc.Base64.stringify(iv)}`;
};

// Decrypt function
const decryptor = (encryptedString) => {
    if (!encryptedString) throw new Error('No text provided for decryption');
    
    const [encryptedData, iv] = encryptedString.split(':');
    if (!encryptedData || !iv) throw new Error('Malformed encrypted string');

    const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY); // Parse key
    const ivWordArray = CryptoJS.enc.Base64.parse(iv); // Parse IV
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: ivWordArray }); // Decrypt

    return decrypted.toString(CryptoJS.enc.Utf8); // Convert to UTF-8
};

module.exports = { encryptor, decryptor };
