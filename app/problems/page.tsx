'use client';

import { Card, Typography } from 'antd';
import { ProblemPicker } from '@/components/ProblemPicker';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function ProblemsPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="problems" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Choose Problem to Solve
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Select the market gap you want to address with innovative solutions.
        </Paragraph>
        <ProblemPicker />
      </Card>
    </div>
  );
}