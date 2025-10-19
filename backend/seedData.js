// Seed script to create test users across multiple days
import User from './models/User.js';

const seedTestData = () => {
    console.log('🌱 Starting data seeding...');

    const users = [
        // 10 days ago
        {
            email: 'user1@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 10
        },
        {
            email: 'user2@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 10
        },

        // 9 days ago
        {
            email: 'user3@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 9
        },
        {
            email: 'user4@test.com',
            role: 'user',
            status: 'inactive',
            daysAgo: 9
        },
        {
            email: 'user5@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 9
        },

        // 8 days ago
        {
            email: 'user6@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 8
        },
        {
            email: 'user7@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 8
        },

        // 7 days ago
        {
            email: 'user8@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 7
        },
        {
            email: 'user9@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 7
        },
        {
            email: 'user10@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 7
        },
        {
            email: 'user11@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 7
        },

        // 6 days ago
        {
            email: 'user12@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 6
        },
        {
            email: 'user13@test.com',
            role: 'user',
            status: 'inactive',
            daysAgo: 6
        },

        // 5 days ago
        {
            email: 'user14@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 5
        },
        {
            email: 'user15@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 5
        },
        {
            email: 'user16@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 5
        },
        {
            email: 'user17@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 5
        },
        {
            email: 'user18@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 5
        },

        // 4 days ago
        {
            email: 'user19@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 4
        },
        {
            email: 'user20@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 4
        },

        // 3 days ago
        {
            email: 'user21@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 3
        },
        {
            email: 'user22@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 3
        },
        {
            email: 'user23@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 3
        },
        {
            email: 'user24@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 3
        },

        // 2 days ago
        {
            email: 'user25@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 2
        },
        {
            email: 'user26@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 2
        },
        {
            email: 'user27@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 2
        },
        {
            email: 'user28@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 2
        },
        {
            email: 'user29@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 2
        },

        // Yesterday
        {
            email: 'user30@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 1
        },
        {
            email: 'user31@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 1
        },
        {
            email: 'user32@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 1
        },

        // Today
        {
            email: 'user33@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 0
        },
        {
            email: 'user34@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 0
        },
        {
            email: 'user35@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 0
        },
        {
            email: 'user36@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 0
        },
        {
            email: 'user37@test.com',
            role: 'user',
            status: 'active',
            daysAgo: 0
        },
        {
            email: 'user38@test.com',
            role: 'admin',
            status: 'active',
            daysAgo: 0
        },
    ];

    let createdCount = 0;

    users.forEach((userData, index) => {
        try {
            // Create user with custom creation date
            const user = User.createWithCustomDate(userData, userData.daysAgo);
            createdCount++;
            console.log(`✅ Created user ${index + 1}: ${userData.email} (${userData.daysAgo} days ago)`);
        } catch (error) {
            console.log(`⚠️  User ${userData.email} might already exist: ${error.message}`);
        }
    });

    console.log(`🌱 Data seeding complete! Created ${createdCount} users across 10 days`);
    console.log('📊 Chart data distribution:');
    console.log('   - 10 days ago: 2 users');
    console.log('   - 9 days ago: 3 users');
    console.log('   - 8 days ago: 2 users');
    console.log('   - 7 days ago: 4 users');
    console.log('   - 6 days ago: 2 users');
    console.log('   - 5 days ago: 5 users');
    console.log('   - 4 days ago: 2 users');
    console.log('   - 3 days ago: 4 users');
    console.log('   - 2 days ago: 5 users');
    console.log('   - Yesterday: 3 users');
    console.log('   - Today: 6 users');
};

export default seedTestData;