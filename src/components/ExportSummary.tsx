'use client';

import { Result, Button, Card, Typography, Space, Timeline, Tag } from 'antd';
import { useState } from 'react';
import { 
  DownloadOutlined, 
  CheckCircleOutlined,
  FileTextOutlined,
  MailOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export function ExportSummary() {
  const [exportLoading, setExportLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setExportLoading(false);
      // In a real app, this would trigger a download
      const element = document.createElement('a');
      const file = new Blob(['# MarketGap AI Analysis Report\n\nYour comprehensive market analysis...'], 
        { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = 'marketgap-analysis-report.md';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handleEmailReport = async () => {
    setEmailLoading(true);
    
    // Simulate email sending
    setTimeout(() => {
      setEmailLoading(false);
    }, 1500);
  };

  const journeySteps = [
    { phase: 'Industry Selection', status: 'completed', detail: 'FinTech selected' },
    { phase: 'Consulting Analysis', status: 'completed', detail: 'McKinsey reports analyzed' },
    { phase: 'Document Research', status: 'completed', detail: '127 PDFs processed' },
    { phase: 'Gap Identification', status: 'completed', detail: '34 gaps identified' },
    { phase: 'Audience Insights', status: 'completed', detail: '3 platforms monitored' },
    { phase: 'Solution Development', status: 'completed', detail: '5 iterations completed' },
    { phase: 'Competitor Analysis', status: 'completed', detail: '12 competitors analyzed' },
    { phase: 'Tech Stack', status: 'completed', detail: 'Full-stack recommendations' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Result
        status="success"
        title="Market Analysis Complete!"
        subTitle="Your comprehensive market gap analysis and solution recommendations are ready."
        extra={[
          <Button
            key="export"
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            loading={exportLoading}
            onClick={handleExport}
            aria-label="Download analysis report"
          >
            {exportLoading ? 'Generating Report...' : 'Download Report'}
          </Button>,
          <Button
            key="email"
            size="large"
            icon={<MailOutlined />}
            loading={emailLoading}
            onClick={handleEmailReport}
            aria-label="Email report to yourself"
          >
            Email Report
          </Button>,
        ]}
      />

      <Card title="Your Journey Summary" style={{ marginTop: 24 }}>
        <Timeline
          items={journeySteps.map(step => ({
            dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            children: (
              <div>
                <Space>
                  <Text strong>{step.phase}</Text>
                  <Tag color="success">✓ Complete</Tag>
                </Space>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {step.detail}
                  </Text>
                </div>
              </div>
            ),
          }))}
        />
      </Card>

      <Card title="What's Included in Your Report" style={{ marginTop: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Executive Summary with key findings</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Detailed market gap analysis with opportunity scores</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Solution recommendations with technical specifications</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Competitive landscape analysis</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Technology stack recommendations</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <Text>Implementation roadmap and next steps</Text>
          </div>
        </Space>
      </Card>

      <Card style={{ marginTop: 16, textAlign: 'center' }}>
        <Title level={4}>Ready to Build?</Title>
        <Paragraph>
          Your market analysis is complete. Use these insights to build innovative 
          solutions that address real market needs. Good luck with your venture!
        </Paragraph>
      </Card>
    </div>
  );
}