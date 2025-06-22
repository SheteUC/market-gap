'use client';

import { Tabs, Timeline, Statistic, Row, Col, Card, Tag, Button } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RedditOutlined, 
  TeamOutlined, 
  RocketOutlined,
  RightOutlined,
  HeartOutlined,
  DislikeOutlined,
  MehOutlined
} from '@ant-design/icons';
import { streamAudienceSignals } from '@/utils/api';
import type { AudienceSignal } from '@/types';

const sentimentIcons = {
  positive: <HeartOutlined style={{ color: '#52c41a' }} />,
  negative: <DislikeOutlined style={{ color: '#ff4d4f' }} />,
  neutral: <MehOutlined style={{ color: '#faad14' }} />,
};

const sentimentColors = {
  positive: 'success',
  negative: 'error',
  neutral: 'warning',
} as const;

export function AudienceInsights() {
  const [signals, setSignals] = useState<Record<string, AudienceSignal[]>>({
    reddit: [],
    meetup: [],
    producthunt: [],
  });
  const [stats, setStats] = useState({
    reddit: { positive: 68, negative: 12, neutral: 20 },
    meetup: { positive: 84, negative: 6, neutral: 10 },
    producthunt: { positive: 72, negative: 15, neutral: 13 },
  });
  const router = useRouter();

  useEffect(() => {
    const loadSignals = async () => {
      try {
        const data = await streamAudienceSignals();
        setSignals(data);
      } catch (error) {
        console.error('Failed to load audience signals:', error);
      }
    };

    loadSignals();
  }, []);

  const renderTimeline = (platform: string) => {
    const platformSignals = signals[platform] || [];
    
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Positive"
                value={stats[platform as keyof typeof stats]?.positive || 0}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
                prefix={<HeartOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Negative"
                value={stats[platform as keyof typeof stats]?.negative || 0}
                suffix="%"
                valueStyle={{ color: '#cf1322' }}
                prefix={<DislikeOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Neutral"
                value={stats[platform as keyof typeof stats]?.neutral || 0}
                suffix="%"
                valueStyle={{ color: '#d48806' }}
                prefix={<MehOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Timeline
          items={platformSignals.map(signal => ({
            dot: sentimentIcons[signal.sentiment],
            children: (
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={sentimentColors[signal.sentiment]}>
                    {signal.sentiment}
                  </Tag>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {signal.timestamp}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>{signal.title}</strong>
                </div>
                <div style={{ color: '#666' }}>
                  {signal.content}
                </div>
              </div>
            ),
          }))}
        />
      </div>
    );
  };

  const items = [
    {
      key: 'reddit',
      label: (
        <span>
          <RedditOutlined />
          Reddit
        </span>
      ),
      children: renderTimeline('reddit'),
    },
    {
      key: 'meetup',
      label: (
        <span>
          <TeamOutlined />
          Meetup
        </span>
      ),
      children: renderTimeline('meetup'),
    },
    {
      key: 'producthunt',
      label: (
        <span>
          <RocketOutlined />
          Product Hunt
        </span>
      ),
      children: renderTimeline('producthunt'),
    },
  ];

  return (
    <div>
      <Tabs items={items} defaultActiveKey="reddit" />
      
      <Row justify="center" style={{ marginTop: 32 }}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            onClick={() => router.push('/problems')}
            aria-label="Continue to problem selection"
          >
            Select Problems to Solve
          </Button>
        </Col>
      </Row>
    </div>
  );
}