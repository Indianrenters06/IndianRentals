// Cashfree Payment Gateway configuration.
// All secrets are read from environment variables — never hardcode them.
//
// Required env vars:
//   CASHFREE_APP_ID      – "AppID" from the Cashfree dashboard
//   CASHFREE_SECRET_KEY  – "Secret Key" from the Cashfree dashboard
//   CASHFREE_ENV         – "production" (live) or "sandbox" (test). Defaults to sandbox.
//   CASHFREE_API_VERSION – Cashfree PG API version. Defaults to 2023-08-01.

const ENV = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();

const IS_PRODUCTION = ENV === 'production' || ENV === 'prod' || ENV === 'live';

const cashfreeConfig = {
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    apiVersion: process.env.CASHFREE_API_VERSION || '2023-08-01',
    isProduction: IS_PRODUCTION,
    // Base URL for the Cashfree PG REST API
    baseUrl: IS_PRODUCTION ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg',
    // "mode" value the frontend JS SDK expects
    mode: IS_PRODUCTION ? 'production' : 'sandbox',
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
    if (!cashfreeConfig.appId || !cashfreeConfig.secretKey) {
        throw new Error('Cashfree is not configured — set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in the environment.');
    }
};

module.exports = { cashfreeConfig, cashfreeHeaders, assertCashfreeConfigured };
