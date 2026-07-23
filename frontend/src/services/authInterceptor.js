import axios from 'axios';
import { clearSession } from './authService';

// Registers a single global axios response interceptor that reacts to 401
// (Unauthorized) responses anywhere in the app. A 401 means the stored session
// token is missing/expired, so we clear it, notify listeners (e.g. the Navbar),
// and send the user to the login page to re-authenticate.

let installed = false;

// Guard so multiple simultaneous 401s only trigger one logout/redirect.
let loggingOut = false;

const forceLogout = () => {
    if (typeof window === 'undefined') return;
    if (loggingOut) return;

    const hadSession = !!localStorage.getItem('userInfo');
    loggingOut = true;

    // Let the Navbar and other listeners update their logged-in state.
    clearSession();

    // Only bounce to login if the user actually had a session that just went
    // stale — avoids redirecting anonymous visitors hitting protected endpoints.
    if (hadSession) {
        const { pathname, search } = window.location;
        // Don't redirect if we're already on the login page.
        if (!pathname.startsWith('/login')) {
            const redirect = encodeURIComponent(pathname + search);
            window.location.href = `/login?session=expired&redirect=${redirect}`;
        }
    }

    // Reset the guard shortly after so a genuinely new session can 401 again.
    setTimeout(() => { loggingOut = false; }, 2000);
};

export const setupAuthInterceptor = () => {
    if (installed) return;
    installed = true;

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                forceLogout();
            }
            return Promise.reject(error);
        }
    );
};

export default setupAuthInterceptor;
