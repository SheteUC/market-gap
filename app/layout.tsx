'use client';

import { ConfigProvider, Layout } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { TopNav } from '@/components/TopNav';
import { WebsocketProvider } from '@/context/WebsocketContext';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorError: '#ff4d4f',
    borderRadius: 8,
  },
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
          <ConfigProvider theme={theme}>
            <WebsocketProvider>
              <Layout style={{ minHeight: '100vh' }}>
                <TopNav />
                <Layout.Content style={{ padding: '24px' }}>
                  {children}
                </Layout.Content>
              </Layout>
            </WebsocketProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}