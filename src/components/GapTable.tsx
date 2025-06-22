'use client';

import { Table, Tag, Button, Space, Typography, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined, TrophyOutlined } from '@ant-design/icons';
import { getGapList } from '@/utils/api';
import type { MarketGap } from '@/types';

const { Text } = Typography;

const severityColors = {
  critical: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'green',
};

export function GapTable() {
  const [gaps, setGaps] = useState<MarketGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadGaps = async () => {
      try {
        const data = await getGapList();
        setGaps(data);
      } catch (error) {
        console.error('Failed to load gaps:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGaps();
  }, []);

  const columns = [
    {
      title: 'Gap Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: (text: string) => (
        <Text strong style={{ fontSize: '14px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Market Size',
      dataIndex: 'marketSize',
      key: 'marketSize',
      render: (size: string) => (
        <Text code>{size}</Text>
      ),
    },
    {
      title: 'Opportunity Score',
      dataIndex: 'opportunityScore',
      key: 'opportunityScore',
      render: (score: number) => (
        <Space>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <Text strong>{score}/100</Text>
        </Space>
      ),
      sorter: (a: MarketGap, b: MarketGap) => a.opportunityScore - b.opportunityScore,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: keyof typeof severityColors) => (
        <Tag color={severityColors[severity]}>
          {severity.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Critical', value: 'critical' },
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
        { text: 'Low', value: 'low' },
      ],
      onFilter: (value: any, record: MarketGap) => record.severity === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag>{category}</Tag>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: MarketGap) => ({
      name: record.id,
    }),
  };

  const handleContinue = () => {
    router.push('/audience');
  };

  return (
    <div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={gaps}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} gaps`,
        }}
        scroll={{ x: 'max-content' }}
      />
      
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={handleContinue}
            aria-label="Continue to audience analysis"
          >
            Analyze Audience Sentiment
          </Button>
        </Col>
      </Row>
    </div>
  );
}