"use client";

import React from 'react';
import { ReduxProvider } from "@/redux/provider";
import { SettingsProvider } from "@/context/SettingsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ReduxProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
