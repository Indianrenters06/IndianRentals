import { redirect } from 'next/navigation';

// Unconditionally redirect to the Overview dashboard for both desktop and mobile
export default function ProfileHome() {
    redirect('/profile/overview');
}
