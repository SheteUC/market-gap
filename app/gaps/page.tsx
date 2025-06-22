'use client';

import { Typography } from 'antd';

const { Title } = Typography;

export default function GapsPage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Title level={2}>Market Gaps</Title>
      <p>Gap analysis results will appear here once the workflow reaches the Analyzer phase.</p>
    </div>
  );
}