'use client';

import { Steps, Progress, Typography, Row, Col, Card, Statistic } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileSearchOutlined, 
  ScanOutlined, 
  BarChartOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const steps = [
  {
    title: 'Scanning Documents',
    description: 'Finding relevant PDF documents',
    icon: <FileSearchOutlined />,
  },
  {
    title: 'Extracting Content',
    description: 'Processing text from documents',
    icon: <ScanOutlined />,
  },
  {
    title: 'Analyzing Patterns',
    description: 'Identifying market gaps and trends',
    icon: <BarChartOutlined />,
  },
  {
    title: 'Complete',
    description: 'Analysis ready for review',
    icon: <CheckCircleOutlined />,
  },
];

export function DocsCrawlerProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    documentsFound: 0,
    pagesProcessed: 0,
    patternsIdentified: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/gaps');
          }, 2000);
          return 100;
        }
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * (steps.length - 1));
        setCurrentStep(stepIndex);
        
        // Update stats
        setStats({
          documentsFound: Math.floor((newProgress / 100) * 127),
          pagesProcessed: Math.floor((newProgress / 100) * 2843),
          patternsIdentified: Math.floor((newProgress / 100) * 34),
        });
        
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Progress 
            percent={Math.round(progress)} 
            status={progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{ marginBottom: 24 }}
          />
        </Col>
        
        <Col span={24}>
          <Steps
            current={currentStep}
            items={steps}
            direction="horizontal"
            size="small"
          />
        </Col>
        
        <Col span={24}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Documents Found"
                  value={stats.documentsFound}
                  suffix="PDFs"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Pages Processed"
                  value={stats.pagesProcessed}
                  suffix="pages"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Patterns Identified"
                  value={stats.patternsIdentified}
                  suffix="gaps"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        
        {progress < 100 && (
          <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">
              {steps[currentStep]?.description || 'Processing...'}
            </Text>
          </Col>
        )}
      </Row>
    </div>
  );
}