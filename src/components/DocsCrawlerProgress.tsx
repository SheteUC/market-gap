'use client';

import { Steps, Progress, Typography, Row, Col, Card, Statistic, Alert, Button, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FileSearchOutlined, 
  ScanOutlined, 
  BarChartOutlined, 
  CheckCircleOutlined,
  ReloadOutlined,
  EyeOutlined 
} from '@ant-design/icons';

const { Text, Paragraph, Title } = Typography;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<any>(null);
  const [chunks, setChunks] = useState<string>('');
  const [stats, setStats] = useState({
    documentsFound: 0,
    pagesProcessed: 0,
    patternsIdentified: 0,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchWorkflowStatus = async () => {
    try {
      const response = await fetch('/api/letta-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      return null;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch workflow status
      const statusData = await fetchWorkflowStatus();

      if (statusData?.success) {
        setResearchData({
          status: statusData.data.status || 'No workflow status available',
          orchestratorId: statusData.data.orchestratorId,
          lastUpdated: new Date().toISOString(),
        });
        
        // Simulate progress based on workflow status
        const status = statusData.data.status || '';
        if (status.includes('complete')) {
          setProgress(100);
          setCurrentStep(3);
        } else if (status.includes('analyzing')) {
          setProgress(75);
          setCurrentStep(2);
        } else {
          setProgress(25);
          setCurrentStep(1);
        }
        
        // Mock some research chunks data for display
        setChunks('Workflow running... Check /simple page for real-time status');
        
        // Update stats with mock data
        setStats({
          documentsFound: Math.floor(Math.random() * 15) + 5,
          pagesProcessed: Math.floor(Math.random() * 200) + 50,
          patternsIdentified: Math.floor(Math.random() * 10) + 3,
        });
      }

    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up polling for updates
    const interval = setInterval(refreshData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewResults = () => {
    router.push('/gaps');
  };

  const selectedGroup = searchParams.get('group');
  const selectedFirms = searchParams.get('firms');
  const selectedIndustry = searchParams.get('industry');
  const selectedIndustryLabel = searchParams.get('label');

  return (
    <div>
      {(selectedIndustry || selectedFirms) && (
        <Alert
          message={
            selectedIndustry 
              ? `Researching ${selectedIndustryLabel || selectedIndustry} industry across ${selectedFirms?.split(',').length || 'multiple'} consulting firms`
              : `Analyzing documents from: ${selectedFirms || 'consulting firms'}`
          }
          description={
            selectedFirms 
              ? `Consulting firms: ${selectedFirms.split(',').join(', ')}`
              : undefined
          }
          type="info"
          style={{ marginBottom: 24 }}
          showIcon
        />
      )}

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

        {error && (
          <Col span={24}>
            <Alert
              message="Error Loading Research Data"
              description={error}
              type="error"
              action={
                <Button size="small" onClick={refreshData} icon={<ReloadOutlined />}>
                  Retry
                </Button>
              }
            />
          </Col>
        )}

        {/* Research Output Section */}
        {chunks && (
          <Col span={24}>
            <Card 
              title="Research Output" 
              extra={
                <Button 
                  size="small" 
                  onClick={refreshData} 
                  icon={<ReloadOutlined />}
                  loading={loading}
                >
                  Refresh
                </Button>
              }
            >
              <Paragraph style={{ maxHeight: '300px', overflow: 'auto', backgroundColor: '#f6f8fa', padding: '12px', borderRadius: '6px' }}>
                <Text code style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                  {chunks}
                </Text>
              </Paragraph>
            </Card>
          </Col>
        )}
        
        <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
          {progress < 100 ? (
            <div>
              <Text type="secondary">
                {steps[currentStep]?.description || 'Processing...'}
              </Text>
              {loading && <Spin style={{ marginLeft: 8 }} />}
            </div>
          ) : (
            <div>
              <Text type="success" style={{ marginRight: 16 }}>
                ✅ Research Complete!
              </Text>
              <Button 
                type="primary" 
                onClick={handleViewResults}
                icon={<EyeOutlined />}
              >
                View Market Gaps
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}