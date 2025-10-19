import User from '../models/User.js';
import cryptoService from '../services/cryptoService.js';

class UserController {
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = User.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }

    // Get user by ID
    static async getUserById(req, res) {
        try {
            const {
                id
            } = req.params;
            const user = User.getById(id);
            res.json(user);
        } catch (error) {
            if (error.message === 'User not found') {
                res.status(404).json({
                    error: error.message
                });
            } else {
                res.status(500).json({
                    error: error.message
                });
            }
        }
    }

    // Create new user
    static async createUser(req, res) {
        try {
            const user = User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            if (error.message === 'Email already exists' || error.message === 'Email is required') {
                res.status(400).json({
                    error: error.message
                });
            } else {
                res.status(500).json({
                    error: error.message
                });
            }
        }
    }

    // Update user
    static async updateUser(req, res) {
        try {
            const {
                id
            } = req.params;
            const user = User.update(id, req.body);
            res.json(user);
        } catch (error) {
            if (error.message === 'User not found') {
                res.status(404).json({
                    error: error.message
                });
            } else if (error.message === 'Email already exists') {
                res.status(400).json({
                    error: error.message
                });
            } else {
                res.status(500).json({
                    error: error.message
                });
            }
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            const {
                id
            } = req.params;
            const result = User.delete(id);
            res.json(result);
        } catch (error) {
            if (error.message === 'User not found') {
                res.status(404).json({
                    error: error.message
                });
            } else {
                res.status(500).json({
                    error: error.message
                });
            }
        }
    }

    // Get user statistics for charts
    static async getUserStats(req, res) {
        try {
            const {
                days = 7
            } = req.query;
            const stats = User.getUsersByDateRange(parseInt(days));
            res.json(stats);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }

    // Export users as Protocol Buffers
    static async exportUsers(req, res) {
        try {
            const users = User.getAll();

            // Convert users to protobuf format
            const protobuf = await import('protobufjs');
            const root = await protobuf.default.load('./proto/User.proto');
            const UserList = root.lookupType('UserList');

            // Prepare data for protobuf
            const usersData = users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: new Date(user.createdAt).getTime() // Convert to timestamp
            }));

            // Create protobuf message
            const message = UserList.create({
                users: usersData
            });
            const buffer = UserList.encode(message).finish();

            // Set proper headers for protobuf
            res.setHeader('Content-Type', 'application/x-protobuf');
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('X-Protobuf-Schema', 'User.proto');

            res.send(buffer);
        } catch (error) {
            console.error('Protobuf export error:', error);
            res.status(500).json({
                error: 'Failed to export users as protobuf'
            });
        }
    }

    // Get public key for signature verification
    static async getPublicKey(req, res) {
        try {
            const publicKey = cryptoService.getPublicKey();
            const status = cryptoService.getStatus();

            res.json({
                publicKey,
                status,
                message: 'Public key for signature verification'
            });
        } catch (error) {
            console.error('Public key retrieval error:', error);
            res.status(500).json({
                error: 'Failed to get public key'
            });
        }
    }
}

export default UserController;