import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Playfair_Display, Lora } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

export const metadata = {
    title: 'AURAH — Premium Spices & Nuts',
    description: 'Discover the finest hand-picked spices and nuts from around the world.',
    keywords: 'spices, nuts, premium, organic',
};

import SmoothScroll from '@/components/SmoothScroll';
import ElegantMenu from '@/components/ElegantMenu';

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
            <body>
                <AuthProvider>
                    <CartProvider>
                        <SmoothScroll />
                        <CursorGlow />
                        <ElegantMenu />
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
