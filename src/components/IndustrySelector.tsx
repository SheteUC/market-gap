'use client';

import { Select, Button, Row, Col, message } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined } from '@ant-design/icons';

const industries = [
  { value: 'fintech', label: 'Financial Technology' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'edtech', label: 'Education Technology' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'energy', label: 'Energy & Sustainability' },
  { value: 'real-estate', label: 'Real Estate & PropTech' },
  { value: 'manufacturing', label: 'Manufacturing & Industry 4.0' },
  { value: 'agriculture', label: 'Agriculture & FoodTech' },
  { value: 'entertainment', label: 'Entertainment & Media' },
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
    message.loading('Saving selection...', 1);

    // Simulate API call
    setTimeout(() => {
      message.success('Industry selected successfully');
      setLoading(false);
      router.push('/consulting');
    }, 1000);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Select
          size="large"
          placeholder="Select an industry to analyze"
          style={{ width: '100%' }}
          value={selectedIndustry}
          onChange={setSelectedIndustry}
          options={industries}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Col>
      <Col span={24} style={{ textAlign: 'center', marginTop: 24 }}>
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={handleNext}
          icon={<RightOutlined />}
          disabled={!selectedIndustry}
          aria-label="Proceed to consulting group selection"
        >
          Continue to Consulting Groups
        </Button>
      </Col>
    </Row>
  );
}