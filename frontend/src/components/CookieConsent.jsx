'use client';

import { lockBodyScroll } from '../lib/bodyScrollLock.mjs';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CONSENT_KEY, CONSENT_LIFETIME, createConsent, parseConsent, createAnalyticsController } from '@/lib/consent.mjs';
import { createSiteAnalytics } from '@/lib/siteAnalytics.mjs';
import { API_BASE_URL } from '@/services/apiConfig';
import styles from './CookieConsent.module.css';

const ConsentContext = createContext(null);
export const useConsent = () => useContext(ConsentContext);

export default function ConsentProvider({ children, analyticsId = '' }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [notice, setNotice] = useState('');
  const controller = useRef(null);
  const telemetry = useRef(null);
  const pathname = usePathname();
  const dialog = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    controller.current ||= createAnalyticsController(analyticsId, window, document);
    function readPreferences() {
      let saved = null;
      try { saved = parseConsent(window.localStorage.getItem(CONSENT_KEY)); } catch { /* Optional tracking stays off. */ }
      controller.current.setAllowed(saved?.analytics === true);
      setChoice(saved);
      setReady(true);
    }
    readPreferences();
    const sync = (event) => { if (event.key === CONSENT_KEY || event.key === null) readPreferences(); };
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('storage', sync); controller.current.setAllowed(false); telemetry.current?.stop(); };
  }, [analyticsId]);

  useEffect(() => {
    telemetry.current ||= createSiteAnalytics({api:API_BASE_URL});
    telemetry.current.setChoice(choice);
    if (!choice) return;
    let timer;
    function checkExpiry() {
      const remaining = choice.updatedAt + CONSENT_LIFETIME - Date.now();
      if (remaining <= 0) {
        controller.current?.setAllowed(false);
        telemetry.current?.stop();
        setChoice(null);
        return;
      }
      // setTimeout is limited to ~24 days. Recheck long-lived tabs safely.
      clearTimeout(timer);
      timer = setTimeout(checkExpiry, Math.min(remaining, 2147483647));
    }
    checkExpiry();
    document.addEventListener('visibilitychange', checkExpiry);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', checkExpiry); };
  }, [choice]);

  useEffect(() => {
    const record = () => {
      if (document.visibilityState === 'visible') telemetry.current?.pageView(pathname, window.innerWidth);
    };
    // Re-sync necessary preferences on reconnection, then retry the current view.
    const reconnect = () => { telemetry.current?.syncPreferences().then(record); };
    record();
    window.addEventListener('online', reconnect);
    document.addEventListener('visibilitychange', record);
    return () => { window.removeEventListener('online', reconnect); document.removeEventListener('visibilitychange', record); };
  }, [choice, pathname]);

  useEffect(() => {
    if (!settingsOpen) return;
    const modal = dialog.current;
    const unlockScroll = lockBodyScroll();
    modal.showModal();
    return () => {
      modal.close();
      unlockScroll();
      if (opener.current?.isConnected) opener.current.focus();
    };
  }, [settingsOpen]);

  function openSettings() {
    opener.current = document.activeElement;
    setAnalytics(choice?.analytics === true);
    setSettingsOpen(true);
  }

  function save(enabled) {
    const next = createConsent(enabled, Math.max(Date.now(), (choice?.updatedAt || 0) + 1), choice?.receiptId);
    telemetry.current?.stop();
    controller.current?.setAllowed(next.analytics);
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
      setNotice('Cookie preferences saved.');
    } catch {
      setNotice('Your choices apply for this visit. Your browser could not save them for next time.');
    }
    setChoice(next);
    setSettingsOpen(false);
  }

  function keepFocusInDialog(event) {
    if (event.key !== 'Tab') return;
    const controls = dialog.current.querySelectorAll('button:not([disabled]), a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const bannerVisible = ready && !choice;
  return (
    <ConsentContext.Provider value={{ openSettings, analyticsAllowed: ready && choice?.analytics === true, consentVisible: !ready || bannerVisible || settingsOpen }}>
      {children}
      <p className={styles.srOnly} role="status">{notice}</p>
      {bannerVisible && (
        <section style={settingsOpen ? { visibility: 'hidden' } : undefined} className={styles.banner} aria-labelledby="cookie-banner-title">
          <div>
            <p className={styles.eyebrow}>Privacy / your choice</p>
            <h2 id="cookie-banner-title" className={styles.bannerTitle}>Cookies, on your terms.</h2>
            <p className={styles.description}>Essential cookies keep this site working and remember your choice. With your permission, we count visits to public pages and device categories to improve our rental site. Read the <a href="/privacy">privacy policy.</a></p>
          </div>
          <div className={styles.bannerActions}>
            <button className={styles.secondary} onClick={() => save(false)}>Reject optional</button>
            <button className={styles.primary} onClick={() => save(true)}>Accept all</button>
            <button className={styles.manage} onClick={openSettings}>Manage choices</button>
          </div>
        </section>
      )}
      <dialog onKeyDown={keepFocusInDialog} ref={dialog} className={styles.dialog} aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description" onCancel={(event) => { event.preventDefault(); setSettingsOpen(false); }}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.eyebrow}>Privacy / preferences</p>
            <h2 id="cookie-settings-title" className={styles.modalTitle}>Choose your cookies.</h2>
          </div>
          <button className={styles.close} aria-label="Close cookie settings" onClick={() => setSettingsOpen(false)}><XMarkIcon width={20} height={20} aria-hidden="true" /></button>
        </div>
        <p id="cookie-settings-description" className={styles.intro}>You can change optional choices whenever you like.</p>
        <div className={styles.options}>
          <div className={styles.option}>
            <div><h3>Essential</h3><p>Needed for sessions, your rental cart, and your privacy preferences. We save your choice, a random receipt reference, and the date for 180 days.</p></div>
            <span className={styles.alwaysOn}>Always on</span>
          </div>
          <div className={styles.option}>
            <div><h3 id="analytics-label">Optional analytics</h3><p id="analytics-description">Counts public page visits and mobile, tablet, or desktop use. Our site analytics excludes form contents, contact details, and full URLs. Records are kept for 90 days. If Google Analytics is configured, it also runs only with this permission. Turn this off at any time in Cookie settings.</p></div>
            <button className={styles.switchButton} role="switch" aria-checked={analytics} aria-labelledby="analytics-label" aria-describedby="analytics-description" onClick={() => setAnalytics(!analytics)}><span className={styles.switchTrack} data-checked={analytics}><span /></span></button>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.secondary} onClick={() => save(false)}>Reject optional</button>
          <button className={styles.primary} onClick={() => save(analytics)}>Save choices</button>
        </div>
        <p className={styles.policy}>Read the <a href="/privacy">privacy policy.</a></p>
      </dialog>
    </ConsentContext.Provider>
  );
}
