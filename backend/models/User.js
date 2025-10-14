import db from '../config/database.js';

class User {
    // Get all users
    static getAll() {
        try {
            return db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
        } catch (error) {
            throw new Error('Failed to fetch users: ' + error.message);
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

            // Insert new user
            const stmt = db.prepare('INSERT INTO users (email, role, status) VALUES (?, ?, ?)');
            const result = stmt.run(email, role, status);

            // Return the created user
            return this.getById(result.lastInsertRowid);
        } catch (error) {
            throw error;
        }
    }

    // Update user
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

            // Update user
            const stmt = db.prepare('UPDATE users SET email = ?, role = ?, status = ? WHERE id = ?');
            const result = stmt.run(email, role, status, id);

            if (result.changes === 0) {
                throw new Error('User not found');
            }

            return this.getById(id);
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