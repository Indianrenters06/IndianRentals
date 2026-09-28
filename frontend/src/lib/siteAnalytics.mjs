import { CONSENT_LIFETIME, CONSENT_VERSION } from './consent.mjs';

// Only broad public page categories leave the browser. Never send a URL, query,
// search term, product identifier, account route, referrer, or form content.
export function pageCategory(pathname) {
  const path = (pathname || '').split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (path === '/') return 'home';
  if (path === '/products' || path === '/categories') return 'catalogue';
  if (/^\/products\/[^/]+$/.test(path)) return 'product';
  if (path.startsWith('/category/')) return 'category';
  if (path === '/locations' || /^\/locations\/[^/]+$/.test(path)) return 'locations';
  if (path === '/services' || /^\/services\/[^/]+$/.test(path)) return 'services';
  if (path === '/blog' || /^\/blog\/[^/]+$/.test(path)) return 'blog';
  return ({ '/contact':'contact', '/about':'about', '/careers':'careers', '/how-it-works':'rental-process', '/rental-process':'rental-process', '/faq':'faq' })[path] || null;
}

export const deviceCategory = width => width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

export function createSiteAnalytics({ api, fetcher = fetch, now = Date.now, uuid = () => globalThis.crypto.randomUUID() }) {
  let choice = null;
  let revision = 0;
  let acknowledged = false;
  let pendingSync = null;
  let tail = Promise.resolve();
  let lastView = null;
  let lastEvent = null;
  const controllers = new Set();
  const permitted = () => choice?.analytics === true && choice.version === CONSENT_VERSION && now() - choice.updatedAt < CONSENT_LIFETIME;
  async function post(endpoint, body, signal) {
    const response = await fetcher(`${api}/api/privacy/${endpoint}`, {
      method:'POST', credentials:'omit', referrerPolicy:'no-referrer',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify(body),
      signal: signal || AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Collection unavailable');
  }
  function sync() {
    if (!choice) return Promise.resolve(false);
    if (acknowledged) return Promise.resolve(true);
    if (pendingSync) return pendingSync;
    const current = revision;
    const snapshot = choice;
    const task = tail.then(async () => {
      if (current !== revision) return false;
      try {
        await post('consent', snapshot);
        if (current === revision) acknowledged = true;
        return current === revision;
      } catch { return false; }
    });
    tail = task;
    pendingSync = task;
    task.finally(() => { if (pendingSync === task) pendingSync = null; });
    return task;
  }
  return {
    syncPreferences: sync,
    setChoice(next) {
      if (choice?.receiptId === next?.receiptId && choice?.updatedAt === next?.updatedAt && choice?.analytics === next?.analytics) return sync();
      revision++;
      choice = next;
      acknowledged = false;
      pendingSync = null;
      lastView = null;
      lastEvent = null;
      // Stop outstanding optional requests immediately on a change of choice.
      for (const controller of controllers) controller.abort();
      controllers.clear();
      return sync();
    },
    async pageView(pathname, width) {
      const page = pageCategory(pathname);
      if (!permitted() || !page) return false;
      const current = revision;
      if (!(await sync()) || current !== revision || !permitted()) return false;
      // Includes the local pathname for navigation deduplication, never in payloads.
      if (lastView === pathname) return false;
      lastView = pathname;
      if (lastEvent?.pathname !== pathname) lastEvent = {pathname,eventId:uuid()};
      const controller = new AbortController();
      controllers.add(controller);
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        await post('page-view', { receiptId:choice.receiptId, eventId:lastEvent.eventId, page, device:deviceCategory(width) }, controller.signal);
        return true;
      } catch { if (current === revision) lastView = null; return false; }
      finally { clearTimeout(timeout); controllers.delete(controller); }
    },
    // Invalidate async work when the provider unmounts without changing consent.
    stop() { revision++; choice = null; for (const controller of controllers) controller.abort(); controllers.clear(); },
  };
}
