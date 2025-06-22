import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { ClientLayout } from './client-layout';

export const metadata: Metadata = {
  title: 'MarketGap AI',
  description: 'AI-powered market gap analysis and business strategy platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ClientLayout>{children}</ClientLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}