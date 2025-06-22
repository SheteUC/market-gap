'use client';

import { Typography } from 'antd';
import { GapTable } from '@/components/GapTable';

const { Title } = Typography;

export default function GapsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ 
          color: '#1e293b',
          marginBottom: '12px',
          fontWeight: 700
        }}>
          Market Gaps
        </Title>
      </div>

      <GapTable />
    </div>
  );
}