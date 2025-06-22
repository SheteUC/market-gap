'use client';

import { Card, Typography } from 'antd';
import { HackathonForm } from '@/components/HackathonForm';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function HackathonPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="hackathon" />
      <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Hackathon Optimization
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Optimize your solution for specific hackathon requirements and categories.
        </Paragraph>
        <HackathonForm />
      </Card>
    </div>
  );
}