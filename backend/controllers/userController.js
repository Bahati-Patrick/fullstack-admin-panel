import User from '../models/User.js';

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
}

export default UserController;