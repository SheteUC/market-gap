'use client';

import { Typography, Spin } from 'antd';
import { DocsCrawlerProgress } from '@/components/DocsCrawlerProgress';
import { Suspense } from 'react';

const { Title, Text } = Typography;

function ResearchContent() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ 
          color: '#1e293b',
          marginBottom: '12px',
          fontWeight: 700
        }}>
          Market Research Analysis
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Analyzing consulting firm reports and white papers to identify market opportunities
        </Text>
      </div>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>}>
        <DocsCrawlerProgress />
      </Suspense>
    </div>
  );
}

export default function ResearchPage() {
  return <ResearchContent />;
}