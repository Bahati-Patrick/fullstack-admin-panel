import db from '../config/database.js';
import cryptoService from '../services/cryptoService.js';

class User {
    // Get all users
    static getAll() {
        try {
            return db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
        } catch (error) {
            throw new Error('Failed to fetch users: ' + error.message);
        }
    }

    // Get users with pagination
    static getAllPaginated(limit, offset) {
        try {
            return db.prepare('SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, offset);
        } catch (error) {
            throw new Error('Failed to fetch users: ' + error.message);
        }
    }

    // Get total count of users
    static getTotalCount() {
        try {
            const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
            return result.count;
        } catch (error) {
            throw new Error('Failed to count users: ' + error.message);
        }
    }

    // Get user by ID
    static getById(id) {
        try {
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Failed to fetch user: ' + error.message);
        }
    }

    // Create new user
    static create(userData) {
        try {
            const {
                email,
                role = 'user',
                status = 'active'
            } = userData;

            // Validate email
            if (!email) {
                throw new Error('Email is required');
            }

            // Check if email already exists
            const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Generate SHA-384 hash of email
            const emailHash = cryptoService.hashEmail(email);

            // Create digital signature
            const signature = cryptoService.signHash(emailHash);

            // Insert new user with crypto data
            const stmt = db.prepare('INSERT INTO users (email, role, status, emailHash, signature) VALUES (?, ?, ?, ?, ?)');
            const result = stmt.run(email, role, status, emailHash, signature);

            // Return the created user
            return this.getById(result.lastInsertRowid);
        } catch (error) {
            throw error;
        }
    }

    // Update user with cryptography support
    static update(id, userData) {
        try {
            const {
                email,
                role,
                status
            } = userData;

            // Check if user exists
            const existingUser = this.getById(id);

            // Check if email is being changed and if new email already exists
            if (email !== existingUser.email) {
                const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
                if (emailExists) {
                    throw new Error('Email already exists');
                }
            }

            // If email is being changed, generate new hash and signature
            let emailHash = existingUser.emailHash;
            let signature = existingUser.signature;

            if (email !== existingUser.email) {
                console.log(`🔐 Email changed for user ${id}, generating new hash and signature...`);
                emailHash = cryptoService.hashEmail(email);
                signature = cryptoService.signHash(emailHash);
                console.log(`✅ New hash and signature generated for ${email}`);
            }

            // Update user with crypto data if email changed
            const stmt = db.prepare('UPDATE users SET email = ?, role = ?, status = ?, emailHash = ?, signature = ? WHERE id = ?');
            const result = stmt.run(email, role, status, emailHash, signature, id);

            if (result.changes === 0) {
                throw new Error('User not found');
            }

            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // Create user with custom creation date (for seeding)
    static createWithCustomDate(userData, daysAgo) {
        try {
            const {
                email,
                role = 'user',
                status = 'active'
            } = userData;

            // Validate email
            if (!email) {
                throw new Error('Email is required');
            }

            // Check if email already exists
            const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Generate SHA-384 hash of email
            const emailHash = cryptoService.hashEmail(email);

            // Create digital signature
            const signature = cryptoService.signHash(emailHash);

            // Calculate custom creation date
            const customDate = new Date();
            customDate.setDate(customDate.getDate() - daysAgo);
            const customDateString = customDate.toISOString();

            // Insert new user with crypto data and custom date
            const stmt = db.prepare('INSERT INTO users (email, role, status, emailHash, signature, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
            const result = stmt.run(email, role, status, emailHash, signature, customDateString);

            // Return the created user
            return this.getById(result.lastInsertRowid);
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static delete(id) {
        try {
            const stmt = db.prepare('DELETE FROM users WHERE id = ?');
            const result = stmt.run(id);

            if (result.changes === 0) {
                throw new Error('User not found');
            }

            return {
                message: 'User deleted successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    // Get users created in the last N days (for chart data)
    static getUsersByDateRange(days = 7) {
        try {
            const query = `
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM users 
        WHERE createdAt >= datetime('now', '-${days} days')
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `;

            return db.prepare(query).all();
        } catch (error) {
            throw new Error('Failed to fetch user statistics: ' + error.message);
        }
    }
}

export default User;