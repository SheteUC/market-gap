'use client';

import { Card, Typography } from 'antd';
import { CompetitorTable } from '@/components/CompetitorTable';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function CompetitorsPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="competitors" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Competitor Analysis
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Analyze existing solutions and identify your competitive advantage.
        </Paragraph>
        <CompetitorTable />
      </Card>
    </div>
  );
}