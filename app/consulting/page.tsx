'use client';

import { Typography, Spin } from 'antd';
import { ConsultingGroupSelector } from '@/components/ConsultingGroupSelector';
import { Suspense } from 'react';

const { Title } = Typography;

function ConsultingContent() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ 
          color: '#1e293b',
          marginBottom: '12px',
          fontWeight: 700
        }}>
          Choose Data Sources
        </Title>
      </div>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>}>
        <ConsultingGroupSelector />
      </Suspense>
    </div>
  );
}

export default function ConsultingPage() {
  return <ConsultingContent />;
}