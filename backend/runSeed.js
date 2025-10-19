// Run the data seeding script
import seedTestData from './seedData.js';
import './config/database.js'; // Ensure database is initialized

console.log('🚀 Starting data seeding process...');
console.log('This will create test users across the last 10 days for chart visualization');

try {
    seedTestData();
    console.log('✅ Data seeding completed successfully!');
    console.log('📊 You can now check the charts to see the data distribution');
    process.exit(0);
} catch (error) {
    console.error('❌ Data seeding failed:', error);
    console.error('Error details:', error.stack);
    process.exit(1);
}