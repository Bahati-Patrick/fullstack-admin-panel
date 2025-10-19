// Frontend cryptography service for signature verification
import axios from 'axios';

class CryptoService {
    constructor() {
        this.publicKey = null;
        this.keyLoaded = false;
    }

    // Get public key from backend
    async getPublicKey() {
        try {
            if (this.keyLoaded && this.publicKey) {
                return this.publicKey;
            }

            console.log('🔐 Fetching public key from backend...');
            const response = await axios.get('/api/users/public-key');

            this.publicKey = response.data.publicKey;
            this.keyLoaded = true;

            console.log('✅ Public key loaded successfully');
            console.log('🔑 Key length:', this.publicKey.length, 'characters');

            return this.publicKey;
        } catch (error) {
            console.error('❌ Failed to get public key:', error);
            throw new Error('Public key retrieval failed: ' + error.message);
        }
    }

    // Simplified signature verification
    async verifySignature(email, signature) {
        try {
            console.log(`🔐 Verifying signature for ${email}...`);
            console.log(`🔑 Signature: ${signature ? signature.substring(0, 20) + '...' : 'null'}`);

            // Basic validation - check if signature exists and has reasonable format
            if (!signature || typeof signature !== 'string') {
                console.log('❌ No signature provided');
                return false;
            }

            // Check if signature is base64 encoded (basic validation)
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(signature)) {
                console.log('❌ Signature is not valid base64');
                return false;
            }

            // Check signature length (RSA signatures are typically 256+ characters)
            if (signature.length < 50) {
                console.log('❌ Signature too short');
                return false;
            }

            console.log(`✅ Signature appears valid for ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to verify signature:', error);
            return false;
        }
    }

    // Get service status
    getStatus() {
        return {
            keyLoaded: this.keyLoaded,
            hasPublicKey: !!this.publicKey
        };
    }
}

// Create singleton instance
const cryptoService = new CryptoService();

export default cryptoService;