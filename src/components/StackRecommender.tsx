'use client';

import { Collapse, Card, Tag, Typography, Space, Button, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CodeOutlined, 
  DatabaseOutlined, 
  CloudOutlined,
  MobileOutlined,
  RightOutlined,
  StarOutlined
} from '@ant-design/icons';
import { getTechStack } from '@/utils/api';
import type { TechStackRecommendation } from '@/types';

const { Title, Text, Paragraph } = Typography;

const categoryIcons = {
  frontend: <CodeOutlined />,
  backend: <DatabaseOutlined />,
  database: <DatabaseOutlined />,
  cloud: <CloudOutlined />,
  mobile: <MobileOutlined />,
};

export function StackRecommender() {
  const [recommendations, setRecommendations] = useState<TechStackRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await getTechStack('idea-1');
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to load tech stack:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const renderTechStack = (stack: TechStackRecommendation) => (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {categoryIcons[stack.category as keyof typeof categoryIcons]}
          {stack.category.charAt(0).toUpperCase() + stack.category.slice(1)}
        </div>
      }
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{stack.matchScore}/100</Text>
        </div>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Recommended Technologies</Title>
          <Space wrap>
            {stack.technologies.map(tech => (
              <Tag key={tech.name} color={tech.recommended ? 'blue' : 'default'}>
                {tech.recommended && <StarOutlined style={{ marginRight: 4 }} />}
                {tech.name}
              </Tag>
            ))}
          </Space>
        </div>
        
        <div>
          <Title level={5}>Why This Stack?</Title>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {stack.reasoning.map((reason, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                <Text>{reason}</Text>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <Title level={5}>Learning Resources</Title>
          <Space direction="vertical" size="small">
            {stack.resources.map((resource, index) => (
              <div key={index}>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '14px' }}
                >
                  {resource.name}
                </a>
                <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                  ({resource.type})
                </Text>
              </div>
            ))}
          </Space>
        </div>
        
        {stack.estimatedLearningTime && (
          <div style={{ 
            backgroundColor: '#f6f8fa', 
            padding: '12px', 
            borderRadius: '6px',
            border: '1px solid #e1e4e8'
          }}>
            <Text strong>Estimated Learning Time: </Text>
            <Text>{stack.estimatedLearningTime}</Text>
          </div>
        )}
      </Space>
    </Card>
  );

  const collapseItems = recommendations.map(stack => ({
    key: stack.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {categoryIcons[stack.category as keyof typeof categoryIcons]}
          {stack.category.charAt(0).toUpperCase() + stack.category.slice(1)} Stack
        </span>
        <Tag color={stack.matchScore > 80 ? 'green' : stack.matchScore > 60 ? 'orange' : 'red'}>
          {stack.matchScore}/100 Match
        </Tag>
      </div>
    ),
    children: renderTechStack(stack),
  }));

  return (
    <div>
      <Collapse
        items={collapseItems}
        defaultActiveKey={recommendations.map(r => r.id)}
        size="large"
      />
      
      <Row justify="center" style={{ marginTop: 32 }}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={() => router.push('/summary')}
            aria-label="View project summary"
          >
            View Project Summary
          </Button>
        </Col>
      </Row>
    </div>
  );
}