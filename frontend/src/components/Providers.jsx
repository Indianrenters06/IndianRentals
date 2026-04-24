"use client";

import React from 'react';
import { ReduxProvider } from "@/redux/provider";
import { SettingsProvider } from "@/context/SettingsContext";

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </ReduxProvider>
  );
}
