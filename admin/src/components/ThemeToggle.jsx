"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@heroui/react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ThemeToggle() {
    const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
    const { theme, setTheme } = useTheme();


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
