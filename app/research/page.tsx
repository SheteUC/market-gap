'use client';

import { Typography, Card, Progress, Button, Row, Col, Tag, Spin, Collapse, List } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface ResearchStatus {
  consultingDocsSize: number;
  consultingDocsContent: string;
  dataStored: boolean;
  timestamp: string;
}

export default function ResearchPage() {
  const [status, setStatus] = useState<any>(null);
  const [researchProgress, setResearchProgress] = useState<ResearchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedDocs, setParsedDocs] = useState<any>(null);
  const router = useRouter();

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/letta-workflow?action=status');
      const data = await response.json();
      setStatus(data);

      // Try to parse consulting_docs JSON from status
      const docsVal = data?.status?.sharedBlocks?.consulting_docs?.value;
      try {
        if (docsVal && docsVal !== 'No research data yet') {
          const json = JSON.parse(docsVal);
          setParsedDocs(json);
        }
      } catch (_) {
        // Couldn't parse as JSON – store raw string for preview
        setParsedDocs(null);
      }

      if (data.success) {
        // Check research progress
        const progressResponse = await fetch('/api/letta-workflow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'research-progress' }),
        });
        const progressData = await progressResponse.json();
        if (progressData.success) {
          setResearchProgress(progressData.progress);
        }
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getProgressPercentage = () => {
    if (!researchProgress) return 0;
    if (researchProgress.dataStored) return 100;
    return researchProgress.consultingDocsSize > 50 ? 50 : 25;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ color: '#1e293b' }}>
          Market Research in Progress
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Orchestrator is managing the workflow and Market Research agent is finding whitepapers
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading workflow status...</div>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {/* Workflow Status */}
          <Col xs={24} lg={12}>
            <Card title="🎯 Orchestrator Status" bordered={false}>
              {status?.success ? (
                <div>
                  <Tag color="green">Active</Tag>
                  <Paragraph>
                    <strong>Orchestrator ID:</strong> {status.status?.orchestratorId?.substring(0, 20)}...
                  </Paragraph>
                  <Paragraph>
                    <strong>Agents:</strong> Orchestrator ✅ | Market Research {status.hasMarketResearch ? '✅' : '⏳'}
                  </Paragraph>
                </div>
              ) : (
                <Tag color="red">No Active Workflow</Tag>
              )}
            </Card>
          </Col>

          {/* Research Progress */}
          <Col xs={24} lg={12}>
            <Card title="📊 Research Progress" bordered={false}>
              <Progress 
                percent={getProgressPercentage()} 
                status={getProgressPercentage() === 100 ? 'success' : 'active'}
                strokeColor="#52c41a"
              />
              {researchProgress && (
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">
                    Data stored: {researchProgress.consultingDocsSize} characters
                  </Text>
                  <br />
                  <Text type="secondary">
                    Status: {researchProgress.dataStored ? 'Research Complete' : 'In Progress'}
                  </Text>
                </div>
              )}
            </Card>
          </Col>

          {/* Memory Blocks Status */}
          <Col xs={24}>
            <Card title="🧠 Shared Memory Blocks" bordered={false}>
              {status?.status?.sharedBlocks ? (
                <Row gutter={[16, 16]}>
                  {Object.entries(status.status.sharedBlocks).map(([label, block]: [string, any]) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={label}>
                      <Card size="small" style={{ height: '120px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>{label.replace(/_/g, ' ')}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Size: {block.size || 0} chars
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                          {new Date(block.lastUpdated).toLocaleTimeString()}
                        </div>
                        {label === 'consulting_docs' && block.size > 50 && (
                          <Tag color="green" style={{ marginTop: '8px', fontSize: '10px' }}>
                            Data Stored
                          </Tag>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Text type="secondary">No memory blocks available</Text>
              )}
            </Card>
          </Col>

          {/* Parsed Consulting Docs */}
          {parsedDocs ? (
            <Col xs={24}>
              <Card title="📄 Consulting Firms Findings" bordered={false}>
                <Collapse accordion>
                  {Object.entries(parsedDocs).map(([firm, data]: any, idx) => (
                    <Panel header={firm} key={idx}>
                      {Array.isArray(data) ? (
                        <List
                          size="small"
                          dataSource={data}
                          renderItem={(item:any) => <List.Item>{JSON.stringify(item)}</List.Item>}
                        />
                      ) : (
                        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</Paragraph>
                      )}
                    </Panel>
                  ))}
                </Collapse>
              </Card>
            </Col>
          ) : (
            status?.status?.sharedBlocks?.consulting_docs?.value && (
              <Col xs={24}>
                <Card title="📄 Consulting Docs (raw)" bordered={false}>
                  <Paragraph style={{
                    backgroundColor:'#f6f8fa', padding:'16px', borderRadius:'8px', fontFamily:'monospace', fontSize:'12px', maxHeight:'300px', overflow:'auto'
                  }}>
                    {status.status.sharedBlocks.consulting_docs.value.substring(0,2000)}
                  </Paragraph>
                </Card>
              </Col>
            )
          )}

          {/* Actions */}
          <Col xs={24} style={{ textAlign: 'center', marginTop: '32px' }}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchStatus}
              style={{ marginRight: '16px' }}
            >
              Refresh Status
            </Button>
            {researchProgress?.dataStored && (
              <Button 
                type="primary" 
                icon={<RightOutlined />}
                onClick={() => router.push('/gaps')}
              >
                View Market Gaps
              </Button>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}