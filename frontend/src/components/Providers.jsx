"use client";

import ConsentProvider from "./CookieConsent";
import React from 'react';
import { ReduxProvider } from "@/redux/provider";
import { SettingsProvider } from "@/context/SettingsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children, analyticsId, nonce }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  if (!googleClientId && process.env.NODE_ENV !== 'production') {
    console.warn('[Providers] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work.');
  }

  const inner = (
    <ReduxProvider>
      <SettingsProvider>
        <ConsentProvider analyticsId={analyticsId}>{children}</ConsentProvider>
      </SettingsProvider>
    </ReduxProvider>
  );

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId} nonce={nonce}>
      {inner}
    </GoogleOAuthProvider>
  ) : inner;
}
