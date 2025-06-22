'use client';

import { Row, Col, Card, Tag, Button, Typography, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrophyOutlined, 
  RightOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  UsergroupAddOutlined 
} from '@ant-design/icons';
import { getGapList } from '@/utils/api';
import type { MarketGap } from '@/types';

const { Title, Text, Paragraph } = Typography;

const severityColors = {
  critical: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'green',
};

export function ProblemPicker() {
  const [gaps, setGaps] = useState<MarketGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadGaps = async () => {
      try {
        const data = await getGapList();
        // Sort by opportunity score and take top gaps
        const topGaps = data
          .sort((a: any, b: any) => b.opportunityScore - a.opportunityScore)
          .slice(0, 6);
        setGaps(topGaps);
      } catch (error) {
        console.error('Failed to load gaps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGaps();
  }, []);

  const handleGapSelect = (gapId: string) => {
    setSelectedGap(gapId);
  };

  const handleContinue = () => {
    if (selectedGap) {
      router.push('/solutions');
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {gaps.map(gap => (
          <Col xs={24} md={12} lg={8} key={gap.id}>
            <Card
              hoverable
              onClick={() => handleGapSelect(gap.id)}
              style={{
                cursor: 'pointer',
                border: selectedGap === gap.id ? '2px solid #1677ff' : '1px solid #d9d9d9',
                position: 'relative',
              }}
              bodyStyle={{ padding: '16px' }}
            >
              {selectedGap === gap.id && (
                <CheckCircleOutlined
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#1677ff',
                    fontSize: '18px',
                  }}
                />
              )}
              
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={severityColors[gap.severity]}>
                    {gap.severity.toUpperCase()}
                  </Tag>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>{gap.opportunityScore}/100</Text>
                  </div>
                </div>
                
                <Title level={5} style={{ margin: 0, lineHeight: 1.3 }}>
                  {gap.description}
                </Title>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {gap.marketSize}
                    </Text>
                  </div>
                  <Tag>{gap.category}</Tag>
                </div>
                
                <Paragraph 
                  style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    margin: 0,
                    lineHeight: 1.4
                  }}
                  ellipsis={{ rows: 2 }}
                >
                  This represents a significant opportunity in the {gap.category.toLowerCase()} 
                  space with strong market demand indicators.
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row justify="center" style={{ marginTop: 32 }}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={handleContinue}
            disabled={!selectedGap}
            aria-label="Start solution development"
          >
            Develop Solutions
          </Button>
        </Col>
      </Row>
    </div>
  );
}