'use client';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen text-slate-800 dark:text-slate-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </div>
    );
}
