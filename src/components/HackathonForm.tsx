'use client';

import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LinkOutlined, RightOutlined } from '@ant-design/icons';
import { CategoriesPicker } from './CategoriesPicker';
import { parseHackathon } from '@/utils/api';

const { Title, Paragraph } = Typography;

interface HackathonFormData {
  devpostUrl: string;
}

export function HackathonForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hackathonData, setHackathonData] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const router = useRouter();

  const handleParseUrl = async (values: HackathonFormData) => {
    setLoading(true);
    const hide = message.loading('Parsing hackathon details...', 0);

    try {
      const data = await parseHackathon(values.devpostUrl);
      setHackathonData(data);
      setShowCategories(true);
      hide();
      message.success('Hackathon parsed successfully!');
    } catch (error) {
      hide();
      message.error('Failed to parse hackathon URL');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/tech-stack');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {!showCategories ? (
        <Card>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
            Hackathon Optimization
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 32 }}>
            Enter a Devpost hackathon URL to optimize your solution for specific 
            competition requirements and prize categories.
          </Paragraph>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleParseUrl}
          >
            <Form.Item
              name="devpostUrl"
              label="Devpost Hackathon URL"
              rules={[
                { required: true, message: 'Please enter a Devpost URL' },
                { type: 'url', message: 'Please enter a valid URL' },
              ]}
            >
              <Input
                size="large"
                placeholder="https://hackathon.devpost.com/"
                prefix={<LinkOutlined />}
              />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  htmlType="submit"
                  block
                  aria-label="Parse hackathon details"
                >
                  Parse Hackathon
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  onClick={handleSkip}
                  block
                  aria-label="Skip hackathon optimization"
                >
                  Skip This Step
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      ) : (
        <div>
          <CategoriesPicker hackathonData={hackathonData} />
          <Row justify="center" style={{ marginTop: 24 }}>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<RightOutlined />}
                onClick={() => router.push('/tech-stack')}
                aria-label="Continue to technology recommendations"
              >
                Get Tech Stack Recommendations
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}