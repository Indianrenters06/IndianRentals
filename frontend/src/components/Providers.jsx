"use client";

import ConsentProvider from "./CookieConsent";
import React from 'react';
import { ReduxProvider } from "@/redux/provider";
import { SettingsProvider } from "@/context/SettingsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children, analyticsId, nonce }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id";

  return (
    <GoogleOAuthProvider clientId={googleClientId} nonce={nonce}>
      <ReduxProvider>
        <SettingsProvider>
          <ConsentProvider analyticsId={analyticsId}>{children}</ConsentProvider>
        </SettingsProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
