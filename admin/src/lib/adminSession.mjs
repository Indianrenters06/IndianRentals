// The cached adminInfo object is display data, never evidence of authorization.
export async function verifyAdminSession(api, token, { signal, fetcher = fetch } = {}) {
  const timeout = AbortSignal.timeout(15000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const response = await fetcher(`${api}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store', signal: requestSignal,
  });
  if (response.status === 401 || response.status === 403) {
    throw Object.assign(new Error('Session not authorized'), { code: 'UNAUTHORIZED' });
  }
  if (!response.ok) throw new Error('Session verification unavailable');
  const profile = await response.json();
  if (!['admin', 'super_admin', 'staff', 'operations_manager', 'sales_executive', 'finance_executive'].includes(profile?.role)
    || profile.isBlocked === true || profile.isActive === false) {
    throw Object.assign(new Error('Session not authorized'), { code: 'UNAUTHORIZED' });
  }
  return profile;
}
