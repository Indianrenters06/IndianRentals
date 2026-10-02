'use client';

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "react-hot-toast";

export function Providers({ children, nonce }) {
    return (
        <NextThemesProvider nonce={nonce} attribute="class" defaultTheme="system" enableSystem>
            <HeroUIProvider>
                {children}
                <Toaster position="top-right" />
            </HeroUIProvider>
        </NextThemesProvider>
    );
}
