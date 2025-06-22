'use client';

import { Layout, Menu, Progress, Badge } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  IndustryOutlined, 
  TeamOutlined, 
  SearchOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CompareOutlined,
  TrophyOutlined,
  ApiOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useWebsocket } from '@/context/WebsocketContext';
import { WebsocketStatus } from './WebsocketStatus';

const { Header } = Layout;

const menuItems = [
  { key: '/industry', label: 'Industry', icon: <IndustryOutlined /> },
  { key: '/consulting', label: 'Consulting', icon: <TeamOutlined /> },
  { key: '/research', label: 'Research', icon: <SearchOutlined /> },
  { key: '/gaps', label: 'Gaps', icon: <BarChartOutlined /> },
  { key: '/audience', label: 'Audience', icon: <UsergroupAddOutlined /> },
  { key: '/problems', label: 'Problems', icon: <BulbOutlined /> },
  { key: '/solutions', label: 'Solutions', icon: <ExperimentOutlined /> },
  { key: '/competitors', label: 'Competitors', icon: <CompareOutlined /> },
  { key: '/hackathon', label: 'Hackathon', icon: <TrophyOutlined /> },
  { key: '/tech-stack', label: 'Tech Stack', icon: <ApiOutlined /> },
  { key: '/summary', label: 'Summary', icon: <FileTextOutlined /> },
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { completedPhases } = useWebsocket();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.key === pathname);
    const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / menuItems.length) * 100 : 0;
    setProgress(progressPercent);
  }, [pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Header style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginRight: '32px',
          color: '#1677ff'
        }}>
          MarketGap AI
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          onClick={handleMenuClick}
          items={menuItems.map(item => ({
            ...item,
            label: (
              <Badge 
                dot={completedPhases.includes(item.key)} 
                offset={[8, -8]}
              >
                {item.label}
              </Badge>
            )
          }))}
          style={{ 
            flex: 1, 
            border: 'none',
            justifyContent: 'center'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Progress 
          percent={Math.round(progress)} 
          showInfo={false} 
          style={{ width: '120px' }}
          strokeColor="#52c41a"
        />
        <WebsocketStatus />
      </div>
    </Header>
  );
}