'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CouponsRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace("/dashboard/coupons/active"); }, [router]);
    return null;
}
