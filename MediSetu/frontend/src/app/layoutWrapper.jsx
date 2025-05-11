'use client';

import { usePathname } from 'next/navigation';
import Topbar from '@/components/Home/Topbar';
import GoToTop from '@/UI/GotoTop';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Home/Footer'), { ssr: false });

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // Routes where Topbar & Footer should be hidden
    const noLayoutRoutes = ['/register', '/login'];

    const hideLayout = noLayoutRoutes.includes(pathname);

    return (
        <>
            {!hideLayout && <Topbar />}
            {children}
            {!hideLayout && (
                <>
                    <GoToTop />
                    <Footer />
                </>
            )}
        </>
    );
}
