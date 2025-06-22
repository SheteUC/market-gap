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

  const fetchResearchStatus = async () => {
    try {
      const response = await fetch('/api/agents/research?type=status');
      if (!response.ok) {
        throw new Error('Failed to fetch research status');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching research status:', error);
      return null;
    }
  };

  const fetchResearchChunks = async () => {
    try {
      const response = await fetch('/api/agents/research?type=chunks');
      if (!response.ok) {
        throw new Error('Failed to fetch research chunks');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching research chunks:', error);
      return null;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both status and chunks
      const [statusData, chunksData] = await Promise.all([
        fetchResearchStatus(),
        fetchResearchChunks()
      ]);

      if (statusData?.success) {
        setResearchData(statusData.data);
        // Simulate progress based on research status
        setProgress(75); // Assume research is in progress
        setCurrentStep(2); // Analyzing patterns step
      }

      if (chunksData?.success) {
        setChunks(chunksData.data.chunks || 'No research data available yet');
        
        // Update stats based on chunks content
        const chunkText = chunksData.data.chunks || '';
        const estimatedDocs = Math.max(1, Math.floor(chunkText.length / 1000));
        const estimatedPages = estimatedDocs * 20;
        const estimatedPatterns = Math.max(1, Math.floor(chunkText.length / 500));

        setStats({
          documentsFound: estimatedDocs,
          pagesProcessed: estimatedPages,
          patternsIdentified: estimatedPatterns,
        });

        // If we have substantial chunks, mark as complete
        if (chunkText.length > 500) {
          setProgress(100);
          setCurrentStep(3);
        }
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