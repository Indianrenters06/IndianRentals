"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@heroui/react";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // placeholder
    }

    return (
        <Button
            isIconOnly
            variant="light"
            aria-label="Toggle Theme"
            className="rounded-full !bg-slate-200/50 dark:!bg-slate-800/50 text-slate-800 dark:text-slate-200 backdrop-blur-md"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
    );
}
