'use client';

import { Card, Typography } from 'antd';
import { ExportSummary } from '@/components/ExportSummary';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function SummaryPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="summary" />
      <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Project Summary
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Review and export your complete market analysis and solution recommendations.
        </Paragraph>
        <ExportSummary />
      </Card>
    </div>
  );
}