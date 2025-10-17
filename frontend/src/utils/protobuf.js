// Protocol Buffers utility for frontend
import protobuf from 'protobufjs';

class ProtobufService {
    constructor() {
        this.root = null;
        this.UserList = null;
        this.initialized = false;
    }

    // Initialize protobuf schema
    async initialize() {
        if (this.initialized) return;

        try {
            // Load the protobuf schema
            this.root = await protobuf.load('/proto/User.proto');
            this.UserList = this.root.lookupType('UserList');
            this.initialized = true;
            console.log('✅ Protobuf schema loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load protobuf schema:', error);
            throw error;
        }
    }

    // Fetch and decode protobuf data
    async fetchUsersAsProtobuf() {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // Fetch protobuf data from backend
            const response = await fetch('/api/users/export');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get the binary data
            const arrayBuffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Decode the protobuf data
            const decoded = this.UserList.decode(uint8Array);

            // Convert to plain JavaScript objects
            const users = decoded.users.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: new Date(user.createdAt).toISOString() // Convert timestamp back to ISO string
            }));

            console.log('✅ Protobuf data decoded successfully:', users.length, 'users');
            return users;
        } catch (error) {
            console.error('❌ Failed to fetch/decode protobuf data:', error);
            throw error;
        }
    }

    // Get protobuf schema info
    getSchemaInfo() {
        if (!this.initialized) {
            return null;
        }

        return {
            messageType: 'UserList',
            fields: this.UserList.fields,
            root: this.root
        };
    }
}

// Create singleton instance
const protobufService = new ProtobufService();

export default protobufService;