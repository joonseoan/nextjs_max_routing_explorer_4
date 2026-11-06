import { ReactNode, Suspense } from 'react';
import './globals.css';
import MainHeader from '@/components/main-header/main-header';

export const metadata = {
  title: 'Next.js Page Routing & Rendering',
  description: 'Learn how to route to different pages.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="page">
          <Suspense>
            <MainHeader />
          </Suspense>
          {children}
        </div>
      </body>
    </html>
  )
}
