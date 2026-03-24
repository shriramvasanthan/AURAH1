import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Script from 'next/script';

export const metadata = {
  title: {
    default: 'AURAH — Premium Spices & Nuts | Madurai, Tamil Nadu',
    template: '%s | AURAH Premium Spices',
  },
  description:
    'Hand-picked premium spices and nuts from the finest farms. Based in Madurai, Tamil Nadu. Order spices online — cardamom, pepper, saffron, dry fruits and more.',
  keywords: [
    'premium spices Madurai',
    'buy spices online Tamil Nadu',
    'dry fruits Madurai',
    'organic spices India',
    'AURAH spices',
    'nuts online Madurai',
    'spices shop Tamil Nadu',
  ],
  authors: [{ name: 'AURAH' }],
  metadataBase: new URL('https://aurah.company'),
  openGraph: {
    title: 'AURAH — Premium Spices & Nuts',
    description:
      'Hand-picked premium spices and nuts from the finest farms. Based in Madurai, Tamil Nadu.',
    url: 'https://aurah.company',
    siteName: 'AURAH',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AURAH Premium Spices & Nuts',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURAH — Premium Spices & Nuts',
    description: 'Hand-picked premium spices and nuts. Based in Madurai, Tamil Nadu.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppFloat />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}