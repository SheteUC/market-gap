'use client';

import { Card, Typography } from 'antd';
import { SolutionWorkbench } from '@/components/SolutionWorkbench';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function SolutionsPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="solutions" />
      <Card style={{ marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Solution Development
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          Iteratively develop and refine solutions for your chosen problem.
        </Paragraph>
        <SolutionWorkbench />
      </Card>
    </div>
  );
}