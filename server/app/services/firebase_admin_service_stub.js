// Firebase Admin Service - Stub implementation
// This is a placeholder until Firebase Admin SDK is properly configured

class FirebaseAdminService {
    constructor() {
        console.log('⚠️ Firebase Admin Service is using stub implementation');
    }

    async getStatistics() {
        return {
            totalUsers: 0,
            totalSubscriptions: 0,
            totalPayments: 0,
            message: 'Firebase Admin not configured'
        };
    }

    async listUsers(maxResults = 100, pageToken) {
        return {
            users: [],
            pageToken: null,
            message: 'Firebase Admin not configured'
        };
    }

    async getUserByUid(uid) {
        return {
            uid,
            email: 'stub@example.com',
            displayName: 'Stub User',
            disabled: false,
            message: 'Firebase Admin not configured'
        };
    }

    async getUserSubscriptions(uid) {
        return [];
    }

    async setUserDisabled(uid, disabled) {
        console.log(`Stub: Would ${disabled ? 'disable' : 'enable'} user ${uid}`);
        return true;
    }

    async setCustomClaims(uid, claims) {
        console.log(`Stub: Would set claims for user ${uid}:`, claims);
        return true;
    }

    async listAllSubscriptions(limit = 50, startAfter) {
        return {
            subscriptions: [],
            lastDoc: null,
            message: 'Firebase Admin not configured'
        };
    }

    async updateSubscriptionStatus(subscriptionId, status) {
        console.log(`Stub: Would update subscription ${subscriptionId} to status ${status}`);
        return true;
    }

    async listAllPayments(limit = 50, startAfter) {
        return {
            payments: [],
            lastDoc: null,
            message: 'Firebase Admin not configured'
        };
    }
}

module.exports = FirebaseAdminService;