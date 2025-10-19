import User from '../models/User.js';
import cryptoService from '../services/cryptoService.js';

class UserController {
    // Get all users with pagination
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 25;
            const offset = (page - 1) * limit;

            const users = User.getAllPaginated(limit, offset);
            const totalUsers = User.getTotalCount();
            const totalPages = Math.ceil(totalUsers / limit);

            res.json({
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
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

    // Get chart data for user creation trends
    static async getChartData(req, res) {
        try {
            const users = User.getAll(); // Get all users

            // Process data for charts
            const chartData = {
                labels: [],
                datasets: [{
                    label: 'Users Created',
                    data: [],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }],
                totalUsers: users.length,
                todayUsers: 0,
                weekAverage: 0
            };

            // Get last 7 days
            const today = new Date();
            const last7Days = [];

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                last7Days.push(date);
            }

            // Count users for each day
            last7Days.forEach((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayUsers = users.filter(user => {
                    const userDate = new Date(user.createdAt).toISOString().split('T')[0];
                    return userDate === dateStr;
                });

                chartData.labels.push(date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }));
                chartData.datasets[0].data.push(dayUsers.length);

                // Count today's users
                if (index === 6) {
                    chartData.todayUsers = dayUsers.length;
                }
            });

            // Calculate week average
            chartData.weekAverage = Math.round(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / 7);

            console.log('📊 Chart data generated:', {
                totalUsers: chartData.totalUsers,
                todayUsers: chartData.todayUsers,
                weekAverage: chartData.weekAverage,
                dailyData: chartData.datasets[0].data
            });

            res.json(chartData);
        } catch (error) {
            console.error('Chart data retrieval error:', error);
            res.status(500).json({
                error: 'Failed to get chart data'
            });
        }
    }

    // Seed test data for charts
    static async seedTestData(req, res) {
        try {
            console.log('🌱 Starting data seeding...');

            const testUsers = [
                // 10 days ago
                {
                    email: 'seed1@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 10
                },
                {
                    email: 'seed2@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 10
                },

                // 9 days ago
                {
                    email: 'seed3@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 9
                },
                {
                    email: 'seed4@test.com',
                    role: 'user',
                    status: 'inactive',
                    daysAgo: 9
                },
                {
                    email: 'seed5@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 9
                },

                // 8 days ago
                {
                    email: 'seed6@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 8
                },
                {
                    email: 'seed7@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 8
                },

                // 7 days ago
                {
                    email: 'seed8@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 7
                },
                {
                    email: 'seed9@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 7
                },
                {
                    email: 'seed10@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 7
                },
                {
                    email: 'seed11@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 7
                },

                // 6 days ago
                {
                    email: 'seed12@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 6
                },
                {
                    email: 'seed13@test.com',
                    role: 'user',
                    status: 'inactive',
                    daysAgo: 6
                },

                // 5 days ago
                {
                    email: 'seed14@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 5
                },
                {
                    email: 'seed15@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 5
                },
                {
                    email: 'seed16@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 5
                },
                {
                    email: 'seed17@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 5
                },
                {
                    email: 'seed18@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 5
                },

                // 4 days ago
                {
                    email: 'seed19@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 4
                },
                {
                    email: 'seed20@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 4
                },

                // 3 days ago
                {
                    email: 'seed21@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 3
                },
                {
                    email: 'seed22@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 3
                },
                {
                    email: 'seed23@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 3
                },
                {
                    email: 'seed24@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 3
                },

                // 2 days ago
                {
                    email: 'seed25@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 2
                },
                {
                    email: 'seed26@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 2
                },
                {
                    email: 'seed27@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 2
                },
                {
                    email: 'seed28@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 2
                },
                {
                    email: 'seed29@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 2
                },

                // Yesterday
                {
                    email: 'seed30@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 1
                },
                {
                    email: 'seed31@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 1
                },
                {
                    email: 'seed32@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 1
                },

                // Today
                {
                    email: 'seed33@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 0
                },
                {
                    email: 'seed34@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 0
                },
                {
                    email: 'seed35@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 0
                },
                {
                    email: 'seed36@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 0
                },
                {
                    email: 'seed37@test.com',
                    role: 'user',
                    status: 'active',
                    daysAgo: 0
                },
                {
                    email: 'seed38@test.com',
                    role: 'admin',
                    status: 'active',
                    daysAgo: 0
                },
            ];

            let createdCount = 0;
            const results = [];

            for (const userData of testUsers) {
                try {
                    const user = User.createWithCustomDate(userData, userData.daysAgo);
                    createdCount++;
                    results.push(`✅ Created: ${userData.email} (${userData.daysAgo} days ago)`);
                } catch (error) {
                    results.push(`⚠️  ${userData.email}: ${error.message}`);
                }
            }

            console.log(`🌱 Data seeding complete! Created ${createdCount} users across 10 days`);

            res.json({
                success: true,
                message: `Data seeding completed! Created ${createdCount} users`,
                created: createdCount,
                total: testUsers.length,
                results: results
            });
        } catch (error) {
            console.error('❌ Data seeding failed:', error);
            res.status(500).json({
                error: 'Failed to seed test data',
                details: error.message
            });
        }
    }
}

export default UserController;