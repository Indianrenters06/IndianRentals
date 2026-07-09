// Lightweight loader for the Cashfree JS v3 checkout SDK.
// Injects the official script once and returns an initialised Cashfree instance.
// Avoids an npm dependency so the SDK is always the latest hosted version.

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let sdkPromise = null;

const loadScript = () => {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Cashfree SDK can only load in the browser'));
    }
    if (window.Cashfree) {
        return Promise.resolve(window.Cashfree);
    }
    if (sdkPromise) return sdkPromise;

    sdkPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SDK_URL;
        script.async = true;
        script.onload = () => {
            if (window.Cashfree) resolve(window.Cashfree);
            else reject(new Error('Cashfree SDK loaded but window.Cashfree is missing'));
        };
        script.onerror = () => {
            sdkPromise = null; // allow a retry on next call
            reject(new Error('Failed to load the Cashfree checkout SDK'));
        };
        document.body.appendChild(script);
    });

    return sdkPromise;
};

// Returns a ready-to-use Cashfree checkout instance.
// mode: 'production' | 'sandbox' — defaults to NEXT_PUBLIC_CASHFREE_MODE.
export const getCashfree = async (mode) => {
    const Cashfree = await loadScript();
    return Cashfree({
        mode: mode || process.env.NEXT_PUBLIC_CASHFREE_MODE || 'production',
    });
};
