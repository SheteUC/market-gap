'use client';

import { Table, Button, Tag, Progress, Space, Typography, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined, LinkOutlined } from '@ant-design/icons';
import { getCompetitors } from '@/utils/api';
import type { Competitor } from '@/types';

const { Text, Link } = Typography;

export function CompetitorTable() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCompetitors = async () => {
      try {
        const data = await getCompetitors('idea-1');
        setCompetitors(data);
      } catch (error) {
        console.error('Failed to load competitors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompetitors();
  }, []);

  const columns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Competitor) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Link 
            href={record.website} 
            target="_blank" 
            style={{ fontSize: '12px' }}
          >
            <LinkOutlined /> Visit Website
          </Link>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text}</Text>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        const stageColors = {
          'Early Stage': 'green',
          'Growth': 'blue',
          'Mature': 'orange',
          'Enterprise': 'red',
        };
        return (
          <Tag color={stageColors[stage as keyof typeof stageColors] || 'default'}>
            {stage}
          </Tag>
        );
      },
      filters: [
        { text: 'Early Stage', value: 'Early Stage' },
        { text: 'Growth', value: 'Growth' },
        { text: 'Mature', value: 'Mature' },
        { text: 'Enterprise', value: 'Enterprise' },
      ],
      onFilter: (value: any, record: Competitor) => record.stage === value,
    },
    {
      title: 'Funding',
      dataIndex: 'funding',
      key: 'funding',
      render: (funding: string) => (
        <Text code>{funding}</Text>
      ),
      sorter: (a: Competitor, b: Competitor) => {
        const parseAmount = (str: string) => {
          const num = parseFloat(str.replace(/[^0-9.]/g, ''));
          if (str.includes('B')) return num * 1000;
          if (str.includes('M')) return num;
          return num / 1000;
        };
        return parseAmount(a.funding) - parseAmount(b.funding);
      },
    },
    {
      title: 'Similarity',
      dataIndex: 'similarity',
      key: 'similarity',
      render: (similarity: number) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Progress 
            percent={similarity} 
            size="small" 
            strokeColor={similarity > 70 ? '#ff4d4f' : similarity > 40 ? '#faad14' : '#52c41a'}
          />
          <Text style={{ fontSize: '12px' }}>
            {similarity > 70 ? 'High overlap' : similarity > 40 ? 'Some overlap' : 'Low overlap'}
          </Text>
        </Space>
      ),
      sorter: (a: Competitor, b: Competitor) => a.similarity - b.similarity,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Key Differentiator',
      dataIndex: 'differentiator',
      key: 'differentiator',
      width: '25%',
      render: (text: string) => (
        <Text style={{ fontSize: '12px', fontStyle: 'italic' }}>
          {text}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={competitors}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} competitors`,
        }}
        scroll={{ x: 'max-content' }}
      />
      
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={() => router.push('/hackathon')}
            aria-label="Continue to hackathon optimization"
          >
            Optimize for Hackathons (Optional)
          </Button>
        </Col>
      </Row>
    </div>
  );
}