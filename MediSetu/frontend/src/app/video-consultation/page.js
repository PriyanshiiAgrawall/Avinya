'use client';

import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import the VideoConsultation component with no SSR
const VideoConsultation = dynamic(
    () => import('@/components/VideoConsultation/VideoConsultation/VideoConsultation'),
    { ssr: false }
);

export default function VideoConsultationPage() {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </Head>
            <main>
                <VideoConsultation />
            </main>
        </>
    );
} 