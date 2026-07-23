// Single source of truth for ending a session. Every logout path (navbar menu,
// profile sidebar, the 401 interceptor) goes through this so they all clear the
// same keys and notify the same listeners.

// Clears the stored session and tells listeners (Navbar, profile pages) to
// re-read localStorage. Does not navigate.
export const clearSession = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');

    window.dispatchEvent(new Event('userInfoChanged'));
};

// Full logout: clear the session and leave the page. A hard navigation is used
// on purpose so in-memory client state (redux, cached profile data) is dropped
// too, instead of lingering on a soft router.push.
export const logout = ({ redirectTo = '/' } = {}) => {
    if (typeof window === 'undefined') return;

    clearSession();

    if (redirectTo) window.location.href = redirectTo;
};

export default logout;
