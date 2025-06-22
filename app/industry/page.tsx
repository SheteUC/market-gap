'use client';

import { Card, Typography } from 'antd';
import { IndustrySelector } from '@/components/IndustrySelector';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function IndustryPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="industry" />
      <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Choose Your Industry
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Select the industry you want to analyze for market gaps and opportunities.
        </Paragraph>
        <IndustrySelector />
      </Card>
    </div>
  );
}