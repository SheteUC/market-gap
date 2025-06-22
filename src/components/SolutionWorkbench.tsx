'use client';

import { Row, Col, Timeline, Card, Button, Typography, Spin, Space, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ReloadOutlined, 
  RightOutlined, 
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { iterateIdeas } from '@/utils/api';
import type { IdeaIteration } from '@/types';

const { Title, Paragraph, Text } = Typography;

export function SolutionWorkbench() {
  const [iterations, setIterations] = useState<IdeaIteration[]>([]);
  const [currentIdea, setCurrentIdea] = useState<IdeaIteration | null>(null);
  const [isIterating, setIsIterating] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load initial iteration
    const loadInitialIdea = async () => {
      try {
        const initialIdea = await iterateIdeas('problem-1');
        setIterations([initialIdea]);
        setCurrentIdea(initialIdea);
      } catch (error) {
        console.error('Failed to load initial idea:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialIdea();
  }, []);

  const handleIterate = async () => {
    setIsIterating(true);
    
    try {
      const newIdea = await iterateIdeas('problem-1');
      setIterations(prev => [...prev, newIdea]);
      setCurrentIdea(newIdea);
    } catch (error) {
      console.error('Failed to iterate idea:', error);
    } finally {
      setIsIterating(false);
    }
  };

  const handleContinue = () => {
    router.push('/competitors');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={24}>
      <Col xs={24} lg={10}>
        <Card title="Iteration History" style={{ height: '600px', overflowY: 'auto' }}>
          <Timeline
            items={iterations.map((iteration, index) => ({
              dot: index === iterations.length - 1 ? 
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                <ClockCircleOutlined style={{ color: '#1677ff' }} />,
              children: (
                <div
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: iteration.id === currentIdea?.id ? '#f0f8ff' : 'transparent',
                  }}
                  onClick={() => setCurrentIdea(iteration)}
                >
                  <div style={{ marginBottom: 4 }}>
                    <Text strong>Iteration {index + 1}</Text>
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                      {iteration.timestamp}
                    </Text>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Score: {iteration.viabilityScore}/100
                  </div>
                  <Paragraph 
                    ellipsis={{ rows: 2 }} 
                    style={{ fontSize: '12px', margin: '4px 0 0 0' }}
                  >
                    {iteration.title}
                  </Paragraph>
                </div>
              ),
            }))}
          />
          
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={isIterating}
              onClick={handleIterate}
              aria-label="Generate new solution iteration"
            >
              {isIterating ? 'Iterating...' : 'Iterate Again'}
            </Button>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} lg={14}>
        {currentIdea && (
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BulbOutlined />
                Current Best Solution
              </div>
            }
            extra={
              <Tag color="blue">
                Score: {currentIdea.viabilityScore}/100
              </Tag>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {currentIdea.title}
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: 1.6 }}>
                  {currentIdea.description}
                </Paragraph>
              </div>
              
              <div>
                <Title level={5}>Key Features</Title>
                <ul style={{ paddingLeft: '20px' }}>
                  {currentIdea.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <Text>{feature}</Text>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <Title level={5}>Target Market</Title>
                <Paragraph>{currentIdea.targetMarket}</Paragraph>
              </div>
              
              <div>
                <Title level={5}>Business Model</Title>
                <Paragraph>{currentIdea.businessModel}</Paragraph>
              </div>
              
              <div style={{ 
                backgroundColor: '#f6f8fa', 
                padding: '16px', 
                borderRadius: '6px',
                border: '1px solid #e1e4e8'
              }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Viability Assessment
                </Title>
                <Row gutter={16}>
                  <Col span={8}>
                    <Text type="secondary">Technical:</Text>
                    <br />
                    <Text strong>{currentIdea.technicalFeasibility}/10</Text>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Market:</Text>
                    <br />
                    <Text strong>{currentIdea.marketPotential}/10</Text>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Competition:</Text>
                    <br />
                    <Text strong>{currentIdea.competitiveAdvantage}/10</Text>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        )}
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={handleContinue}
            aria-label="Analyze competitors"
          >
            Analyze Competitors
          </Button>
        </div>
      </Col>
    </Row>
  );
}