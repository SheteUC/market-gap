'use client';

import { Card, Typography } from 'antd';
import { StackRecommender } from '@/components/StackRecommender';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function TechStackPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="tech-stack" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Technology Stack Recommendations
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Get personalized technology recommendations based on your solution requirements.
        </Paragraph>
        <StackRecommender />
      </Card>
    </div>
  );
}