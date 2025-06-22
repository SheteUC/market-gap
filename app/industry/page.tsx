'use client';

import { Typography, Steps } from 'antd';
import { IndustrySelector } from '@/components/IndustrySelector';

const { Title, Text } = Typography;


export default function IndustryPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Simple Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ 
          color: '#1e293b',
          marginBottom: '12px',
          fontWeight: 700
        }}>
          Choose Your Industry
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          We'll analyze market research from leading consulting firms to identify opportunities in your chosen industry
        </Text>
      </div>

      {/* Main Selection */}
      <IndustrySelector />
    </div>
  );
}