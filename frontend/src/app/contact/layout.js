'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactLayout({ children }) {
    return (
        <div className="bg-white min-h-screen">
            {children}
        </div>
    );
}
