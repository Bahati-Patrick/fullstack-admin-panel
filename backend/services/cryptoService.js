// Cryptography service for SHA-384 hashing and RSA digital signatures
import crypto from 'crypto';

class CryptoService {
    constructor() {
        this.privateKey = null;
        this.publicKey = null;
        this.keyPairGenerated = false;
    }

    // Generate RSA keypair on service initialization
    generateKeyPair() {
        try {
            console.log('🔐 Generating RSA keypair...');

            const keyPair = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048, // 2048-bit key for good security
                publicKeyEncoding: {
                    type: 'spki', // Subject Public Key Info format
                    format: 'pem' // Privacy-Enhanced Mail format
                },
                privateKeyEncoding: {
                    type: 'pkcs8', // Private Key Information Syntax Standard
                    format: 'pem'
                }
            });

            this.privateKey = keyPair.privateKey;
            this.publicKey = keyPair.publicKey;
            this.keyPairGenerated = true;

            console.log('✅ RSA keypair generated successfully');
            console.log('🔑 Public key length:', this.publicKey.length, 'characters');
            console.log('🔑 Private key length:', this.privateKey.length, 'characters');

            return {
                publicKey: this.publicKey,
                privateKey: this.privateKey
            };
        } catch (error) {
            console.error('❌ Failed to generate RSA keypair:', error);
            throw new Error('Keypair generation failed: ' + error.message);
        }
    }

    // Hash email using SHA-384
    hashEmail(email) {
        try {
            if (!email || typeof email !== 'string') {
                throw new Error('Email must be a non-empty string');
            }

            // Create SHA-384 hash
            const hash = crypto.createHash('sha384').update(email).digest('hex');

            console.log(`🔐 SHA-384 hash for ${email}: ${hash.substring(0, 16)}...`);
            return hash;
        } catch (error) {
            console.error('❌ Failed to hash email:', error);
            throw new Error('Email hashing failed: ' + error.message);
        }
    }

    // Create digital signature for a hash
    signHash(hash) {
        try {
            if (!this.privateKey) {
                throw new Error('Private key not available. Generate keypair first.');
            }

            if (!hash || typeof hash !== 'string') {
                throw new Error('Hash must be a non-empty string');
            }

            // Create digital signature using RSA-PSS padding
            const signature = crypto.sign('sha256', Buffer.from(hash, 'hex'), {
                key: this.privateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING
            }).toString('base64');

            console.log(`🔐 Digital signature created: ${signature.substring(0, 16)}...`);
            return signature;
        } catch (error) {
            console.error('❌ Failed to create digital signature:', error);
            throw new Error('Digital signature creation failed: ' + error.message);
        }
    }

    // Verify digital signature
    verifySignature(hash, signature, publicKey = null) {
        try {
            const keyToUse = publicKey || this.publicKey;

            if (!keyToUse) {
                throw new Error('Public key not available for verification');
            }

            if (!hash || !signature) {
                throw new Error('Hash and signature are required for verification');
            }

            // Verify the signature
            const isValid = crypto.verify('sha256', Buffer.from(hash, 'hex'), {
                key: keyToUse,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING
            }, Buffer.from(signature, 'base64'));

            console.log(`🔐 Signature verification: ${isValid ? 'VALID' : 'INVALID'}`);
            return isValid;
        } catch (error) {
            console.error('❌ Failed to verify signature:', error);
            return false;
        }
    }

    // Get public key for frontend verification
    getPublicKey() {
        if (!this.keyPairGenerated) {
            throw new Error('Keypair not generated yet');
        }
        return this.publicKey;
    }

    // Get keypair status
    getStatus() {
        return {
            keyPairGenerated: this.keyPairGenerated,
            hasPrivateKey: !!this.privateKey,
            hasPublicKey: !!this.publicKey
        };
    }
}

// Create singleton instance
const cryptoService = new CryptoService();

export default cryptoService;