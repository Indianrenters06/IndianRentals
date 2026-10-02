// Cashfree Payment Gateway configuration.
// All secrets are read from environment variables — never hardcode them.
//
// Required env vars:
//   CASHFREE_APP_ID      – "AppID" from the Cashfree dashboard
//   CASHFREE_SECRET_KEY  – "Secret Key" from the Cashfree dashboard
//   CASHFREE_ENV         – sandbox only during controlled remediation.
//   CASHFREE_API_VERSION – Cashfree PG API version. Defaults to 2023-08-01.

const ENV = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();

const cashfreeConfig = {
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    apiVersion: process.env.CASHFREE_API_VERSION || '2023-08-01',
    isProduction: false,
    // Base URL for the Cashfree PG REST API
    baseUrl: 'https://sandbox.cashfree.com/pg',
    // "mode" value the frontend JS SDK expects
    mode: 'sandbox',
};

// Headers required on every authenticated Cashfree API request.
const cashfreeHeaders = () => ({
    'x-client-id': cashfreeConfig.appId,
    'x-client-secret': cashfreeConfig.secretKey,
    'x-api-version': cashfreeConfig.apiVersion,
    'Content-Type': 'application/json',
});

// Throws a clear error if the gateway isn't configured, so failures are
// obvious instead of surfacing as opaque 401s from Cashfree.
const assertCashfreeConfigured = () => {
    if (ENV !== 'sandbox') {
        const error = new Error('Live Cashfree is disabled. Configure CASHFREE_ENV=sandbox.');
        error.statusCode = 503; throw error;
    }
    if (!cashfreeConfig.appId || !cashfreeConfig.secretKey) {
        const error = new Error('Sandbox payment configuration is unavailable.');
        error.statusCode = 503; throw error;
    }
};

module.exports = { cashfreeConfig, cashfreeHeaders, assertCashfreeConfigured };
