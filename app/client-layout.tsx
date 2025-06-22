'use client';

import { ConfigProvider, Layout, Menu, Progress, Badge, Typography, Avatar } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { WebsocketProvider } from '@/context/WebsocketContext';
import { 
  BuildOutlined, 
  TeamOutlined, 
  SearchOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  BulbOutlined,
  ExperimentOutlined,
  DiffOutlined,
  TrophyOutlined,
  ApiOutlined,
  FileTextOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title } = Typography;

const theme = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#10b981',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#1e293b',
    },
    Menu: {
      darkBg: '#1e293b',
      darkItemBg: 'transparent',
      darkItemSelectedBg: '#334155',
      darkItemHoverBg: '#334155',
    },
  },
};

const menuItems = [
  { key: '/industry', label: 'Industry', icon: <BuildOutlined /> },
  { key: '/consulting', label: 'Data Sources', icon: <TeamOutlined /> },
  { key: '/research', label: 'Research', icon: <SearchOutlined /> },
  { key: '/gaps', label: 'Gaps', icon: <BarChartOutlined /> },
  { key: '/audience', label: 'Audience', icon: <UsergroupAddOutlined /> },
  { key: '/problems', label: 'Problems', icon: <BulbOutlined /> },
  { key: '/solutions', label: 'Solutions', icon: <ExperimentOutlined /> },
  { key: '/competitors', label: 'Competitors', icon: <DiffOutlined /> },
  { key: '/hackathon', label: 'Hackathon', icon: <TrophyOutlined /> },
  { key: '/tech-stack', label: 'Tech Stack', icon: <ApiOutlined /> },
  { key: '/summary', label: 'Summary', icon: <FileTextOutlined /> },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.key === pathname);
    if (currentIndex >= 0) {
      setProgress(((currentIndex + 1) / menuItems.length) * 100);
    }
  }, [pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <ConfigProvider theme={theme}>
      <WebsocketProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={setCollapsed}
            theme="dark"
            width={240}
            style={{ boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)' }}
          >
            {/* Logo */}
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid #334155',
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <Avatar 
                size="default" 
                style={{ backgroundColor: '#6366f1' }}
                icon={<RobotOutlined />}
              />
              {!collapsed && (
                <Title level={4} style={{ margin: 0, color: 'white' }}>
                  MarketGap AI
                </Title>
              )}
            </div>

            {/* Progress */}
            {!collapsed && (
              <div style={{ padding: '16px 20px' }}>
                <Progress 
                  percent={Math.round(progress)} 
                  showInfo={false} 
                  strokeColor="#6366f1"
                  size="small"
                />
              </div>
            )}

            {/* Menu */}
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              onClick={handleMenuClick}
              theme="dark"
              style={{ borderRight: 'none' }}
              items={menuItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
              }))}
            />
          </Sider>

          <Layout>
            <Content style={{ 
              padding: '24px',
              background: '#f8fafc'
            }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto',
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </WebsocketProvider>
    </ConfigProvider>
  );
} 