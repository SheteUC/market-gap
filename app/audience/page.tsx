'use client';

import { Card, Typography } from 'antd';
import { AudienceInsights } from '@/components/AudienceInsights';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function AudiencePage() {
  return (
    <div>
      <PhaseBreadcrumbs current="audience" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Audience Insights
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Real-time audience sentiment and discussions from various platforms.
        </Paragraph>
        <AudienceInsights />
      </Card>
    </div>
  );
}