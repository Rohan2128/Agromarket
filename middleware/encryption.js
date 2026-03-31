// ============================================================
// E2E Encryption Utility - AES-256 Encryption
// ============================================================
const CryptoJS = require('crypto-js');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'agromarket_e2e_encryption_key_256bit!';

const encryption = {
  // Encrypt sensitive data
  encrypt(data) {
    if (!data) return '';
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
  },

  // Decrypt sensitive data
  decrypt(ciphertext) {
    if (!ciphertext) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(decryptedStr);
      } catch {
        return decryptedStr;
      }
    } catch (err) {
      console.error('Decryption error:', err.message);
      return null;
    }
  },

  // Middleware to decrypt request body if encrypted
  decryptMiddleware(req, res, next) {
    if (req.body && req.body._encrypted) {
      try {
        const decrypted = encryption.decrypt(req.body._encrypted);
        if (decrypted) {
          req.body = { ...decrypted, _wasEncrypted: true };
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Failed to decrypt request data' });
      }
    }
    next();
  }
};

module.exports = encryption;
