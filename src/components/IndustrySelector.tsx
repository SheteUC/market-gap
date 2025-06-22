'use client';

import { Button, Row, Col, message, Card, Typography } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const industries = [
  { value: 'fintech', label: 'FinTech', emoji: '💳' },
  { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { value: 'edtech', label: 'EdTech', emoji: '📚' },
  { value: 'retail', label: 'Retail', emoji: '🛒' },
  { value: 'logistics', label: 'Logistics', emoji: '🚚' },
  { value: 'energy', label: 'Energy', emoji: '🌱' },
  { value: 'real-estate', label: 'Real Estate', emoji: '🏢' },
  { value: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
  { value: 'agriculture', label: 'Agriculture', emoji: '🌾' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
];

export function IndustrySelector() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!selectedIndustry) {
      message.error('Please select an industry');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      message.success('Industry selected');
      setLoading(false);
      router.push('/consulting');
    }, 800);
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {industries.map((industry) => (
          <Col xs={12} sm={8} lg={6} key={industry.value}>
            <Card
              size="small"
              hoverable
              onClick={() => setSelectedIndustry(industry.value)}
              style={{
                borderRadius: '8px',
                border: selectedIndustry === industry.value ? '2px solid #6366f1' : '1px solid #e5e7eb',
                backgroundColor: selectedIndustry === industry.value ? '#f8fafc' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                height: '80px'
              }}
              bodyStyle={{ padding: '12px' }}
            >
              {selectedIndustry === industry.value && (
                <CheckCircleOutlined style={{ 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px',
                  color: '#6366f1',
                  fontSize: '14px'
                }} />
              )}
              
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {industry.emoji}
              </div>
              <Text style={{ 
                fontSize: '13px', 
                color: selectedIndustry === industry.value ? '#6366f1' : '#374151',
                fontWeight: selectedIndustry === industry.value ? 600 : 400
              }}>
                {industry.label}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedIndustry && (
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleNext}
            icon={<RightOutlined />}
            style={{
              height: '44px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}