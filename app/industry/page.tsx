'use client';

import { Typography, Steps } from 'antd';
import { IndustrySelector } from '@/components/IndustrySelector';

const { Title } = Typography;


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
        
      
      </div>

      {/* Main Selection */}
      <IndustrySelector />
    </div>
  );
}