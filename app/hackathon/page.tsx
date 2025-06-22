'use client';

import { Typography } from 'antd';

const { Title } = Typography;

export default function HackathonPage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Title level={2}>Hackathon Constraints</Title>
      <p>Upload a Devpost URL to parse constraints (coming soon).</p>
    </div>
  );
}