'use client';

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <HeroUIProvider>
                {children}
                <Toaster position="top-right" />
            </HeroUIProvider>
        </NextThemesProvider>
    );
}
