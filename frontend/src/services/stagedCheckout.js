import { API_BASE_URL } from './apiConfig';
import { stagedCheckoutError } from '@/lib/stagedCheckoutModel.mjs';

export function checkoutUser() {
    try { return JSON.parse(localStorage.getItem('userInfo') || 'null'); } catch { return null; }
}
export async function stagedRequest(path, body) {
    const token = checkoutUser()?.token;
    if (!token) throw new Error('Sign in to continue your booking.');
    const response = await fetch(`${API_BASE_URL}/api${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
        cache: 'no-store', ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw stagedCheckoutError(path, response.status, data);
    return data;
}
