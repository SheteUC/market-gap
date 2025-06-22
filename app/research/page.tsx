'use client';

import { Card, Typography } from 'antd';
import { DocsCrawlerProgress } from '@/components/DocsCrawlerProgress';
import { PhaseBreadcrumbs } from '@/components/PhaseBreadcrumbs';

const { Title, Paragraph } = Typography;

export default function ResearchPage() {
  return (
    <div>
      <PhaseBreadcrumbs current="research" />
      <Card style={{ maxWidth: 800, margin: '0 auto', marginTop: 24 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Document Analysis
        </Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 16, marginBottom: 32 }}>
          We're crawling and analyzing industry documents to identify patterns and gaps.
        </Paragraph>
        <DocsCrawlerProgress />
      </Card>
    </div>
  );
}