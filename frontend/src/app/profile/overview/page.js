'use client';

import Link from 'next/link';
import {
    ArrowUpRight,
    ChatCircleDots,
    CreditCard,
    FileText,
    Heart,
    IdentificationCard,
    MapPin,
    ShoppingCart,
    UserCircle,
} from '@phosphor-icons/react';
import { profileTitleClassName } from '../profileTitle';

const cards = [
    { title: 'My Orders', description: 'Track, return, or buy things again.', icon: ShoppingCart, href: '/profile/orders' },
    { title: 'My Invoices', description: 'Download invoices for your orders.', icon: FileText, href: '/profile/invoices' },
    { title: 'Most Liked', description: 'See the products you saved.', icon: Heart, href: '/profile/liked' },
    { title: 'Your Addresses', description: 'Edit addresses for orders and gifts.', icon: MapPin, href: '/profile/addresses' },
    { title: 'KYC & Documentation', description: 'Complete your KYC to rent products.', icon: IdentificationCard, href: '/profile/kyc' },
    { title: 'Profile Settings', description: 'Update your name, email, and photo.', icon: UserCircle, href: '/profile/settings' },
    { title: 'Payment Methods', description: 'See how payments work at checkout.', icon: CreditCard, href: '/profile/methods' },
    { title: 'Get In Touch', description: 'Contact customer support.', icon: ChatCircleDots, href: '/profile/contact' },
];

function OverviewCard({ card }) {
    const isSupport = card.href === '/profile/contact';
    const Icon = card.icon;

    return (
        <Link
            href={card.href}
            className={`group relative flex min-h-[112px] items-start gap-4 rounded-2xl border border-[#dedede] bg-white p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:border-[#d3b454] hover:bg-[#fffaf0] hover:shadow-[0_16px_28px_-20px_rgba(20,20,20,0.35)] focus-visible:-translate-y-1 focus-visible:border-[#141414] focus-visible:bg-[#fffaf0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[174px] sm:flex-col sm:gap-0 sm:p-5 ${isSupport ? 'lg:col-span-2 lg:flex-row lg:items-center lg:gap-5' : ''}`}
        >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f6f6f6] text-[#292929] transition-colors duration-200 group-hover:bg-[#ffedb7] group-focus-visible:bg-[#ffedb7]">
                <Icon className="size-[22px]" weight="bold" aria-hidden="true" />
            </span>
            <span className={`mt-1 block min-w-0 pr-6 sm:mt-5 sm:pr-8 ${isSupport ? 'lg:mt-0' : ''}`}>
                <span className="block text-[18px] font-semibold leading-6 tracking-[-0.02em] text-[#141414]">{card.title}</span>
                <span className="mt-1.5 block text-[15px] leading-6 text-[#545454]">{card.description}</span>
            </span>
            <ArrowUpRight className="absolute right-4 top-4 size-5 text-[#545454] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none sm:right-5 sm:top-5 lg:top-6" weight="bold" aria-hidden="true" />
        </Link>
    );
}

import { logout } from '../../../services/authService';
import { useRouter } from 'next/navigation';

export default function OverviewPage() {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
        window.dispatchEvent(new Event('userInfoChanged'));
    };

    return (
        <>
            <div className="flex flex-col gap-5">
                <h1 className={profileTitleClassName}>Overview</h1>
                <div className="h-px w-full bg-[#dedede]" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => <OverviewCard key={card.href} card={card} />)}
                </div>

                <button
                    onClick={handleLogout}
                    className="min-h-11 w-full rounded-full bg-[#c8170d] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#a8130b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] lg:hidden"
                >
                    Logout
                </button>
            </div>
        </>
    );
}
