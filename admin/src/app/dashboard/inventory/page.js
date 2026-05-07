'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";

export default function InventoryIndex() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the default sub-page (Available Stock)
        router.push("/dashboard/inventory/available");
    }, [router]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 pt-20">
            <Skeleton className="w-64 h-8 rounded-lg" />
            <Skeleton className="w-48 h-4 rounded-lg" />
        </div>
    );
}
