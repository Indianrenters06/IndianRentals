'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace("/dashboard/notifications/push"); }, [router]);
    return null;
}
