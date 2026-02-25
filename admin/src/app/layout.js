import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Portal | IndianRentals",
  description: "Secure Admin Management Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={outfit.className}>
        <Providers>
          <div className="relative min-h-screen bg-slate-900 overflow-hidden text-slate-100">
            {/* Background animated elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="relative z-10">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
