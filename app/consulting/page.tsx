'use client';

import { Card, Typography } from 'antd';
import { ConsultingGroupSelector } from '@/components/ConsultingGroupSelector';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function ConsultingPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="consulting" />
      <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Select Consulting Group
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Choose the consulting group whose insights you want to analyze.
        </Paragraph>
        <ConsultingGroupSelector />
      </Card>
    </div>
  );
}