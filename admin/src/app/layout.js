import "@fontsource/mona-sans/400.css";
import "@fontsource/mona-sans/500.css";
import "@fontsource/mona-sans/600.css";
import "@fontsource/mona-sans/700.css";
import "@fontsource/mona-sans/800.css";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Admin Portal | IndianRentals",
  description: "Secure Admin Management Portal",
};

// The admin panel is a fully client-side, auth-gated SPA — there is no value in
// static prerendering, and next-themes' ThemeProvider/useTheme crash during the
// static export phase under React 19. Force dynamic rendering for all routes.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: '"Mona Sans", sans-serif' }}>
        <Providers>
          <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300">
            {/* Background animated elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 dark:bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="relative z-10">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
