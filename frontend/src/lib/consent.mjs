export const CONSENT_KEY = 'ir-cookie-consent';
export const CONSENT_VERSION = 2;
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;

export function createConsent(analytics, now = Date.now(), receiptId = globalThis.crypto.randomUUID()) {
  return { version: CONSENT_VERSION, receiptId, essential: true, analytics: analytics === true, updatedAt: now };
}

export function parseConsent(raw, now = Date.now()) {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== CONSENT_VERSION || value.essential !== true ||
        !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value.receiptId || '') ||
        typeof value.analytics !== 'boolean' || !Number.isFinite(value.updatedAt) ||
        value.updatedAt > now || now - value.updatedAt >= CONSENT_LIFETIME) return null;
    return createConsent(value.analytics, value.updatedAt, value.receiptId);
  } catch { return null; }
}

// Only our optional analytics cookies are removed; cart and login cookies are untouched.
export function clearAnalyticsCookies(doc, hostname) {
  const domains = hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'));
  for (const item of doc.cookie.split(';')) {
    const name = item.trim().split('=')[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    const expired = `${name}=; Max-Age=0; path=/`;
    doc.cookie = expired;
    for (const domain of domains) {
      doc.cookie = `${expired}; domain=${domain}`;
      doc.cookie = `${expired}; domain=.${domain}`;
    }
  }
}

export function createAnalyticsController(id, win, doc) {
  let allowed = false;
  let script;
  let initialized = false;
  const consent = (enabled) => ({
    analytics_storage: enabled ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  function initialize() {
    if (!allowed || initialized) return;
    win.dataLayer = win.dataLayer || [];
    win.gtag = win.gtag || function () { win.dataLayer.push(arguments); };
    win.gtag('consent', 'default', consent(true));
    win.gtag('js', new Date());
    win.gtag('config', id, { page_path: win.location.pathname, allow_google_signals: false, allow_ad_personalization_signals: false });
    initialized = true;
  }
  return {
    setAllowed(value) {
      allowed = value === true;
      if (!id) return;
      win[`ga-disable-${id}`] = !allowed;
      if (initialized) win.gtag('consent', 'update', consent(allowed));
      if (!allowed) { clearAnalyticsCookies(doc, win.location.hostname); return; }
      if (!script) {
        script = doc.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        script.onload = () => { script.dataset.loaded = 'true'; initialize(); };
        script.onerror = () => { script.remove(); script = undefined; };
        doc.head.appendChild(script);
      } else if (script.dataset.loaded === 'true') initialize();
    },
  };
}
