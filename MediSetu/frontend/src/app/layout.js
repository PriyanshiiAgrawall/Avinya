'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import dynamic from 'next/dynamic';
import { Montserrat } from 'next/font/google';
import { Suspense } from 'react';
import Topbar from '@/components/Home/Topbar';
import GoToTop from '@/UI/GotoTop';
import { StoreProvider } from '@/redux/StoreProvider';

const Footer = dynamic(() => import('@/components/Home/Footer'), { ssr: false });

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap'
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide layout for auth pages
  const noLayoutRoutes = ['/register', '/login'];
  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextTopLoader color="#3B82F6" crawlSpeed={5} showSpinner={false} speed={5} />
        <Suspense fallback={null}>
          <StoreProvider>
            {!hideLayout && <Topbar />}
            {children}
            {!hideLayout && (
              <>
                <GoToTop />
                <Footer />
              </>
            )}
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
