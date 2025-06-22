'use client';

import { Card, Typography } from 'antd';
import { GapTable } from '@/components/GapTable';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function GapsPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="gaps" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Market Gaps Analysis
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Here are the identified market gaps ranked by opportunity score.
        </Paragraph>
        <GapTable />
      </Card>
    </div>
  );
}