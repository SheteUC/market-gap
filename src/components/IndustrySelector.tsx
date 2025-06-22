'use client';

import { Button, Row, Col, message, Card, Typography } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { CONSULTING_FIRMS } from '@/config/letta';

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

  const handleStartResearch = async () => {
    if (!selectedIndustry) {
      message.error('Please select an industry');
      return;
    }

    setLoading(true);
    const hide = message.loading('Initializing agents and starting research...', 0);

    try {
      // Step 1: Initialize agents
      console.log('🚀 Initializing agents...');
      const initResponse = await fetch('/api/agents/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize agents');
      }

      const initData = await initResponse.json();
      console.log('✅ Agents initialized:', initData);

      // Step 2: Start research for ALL consulting firms
      console.log('📄 Starting research for all consulting firms...');
      
      const researchResponse = await fetch('/api/agents/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'crawl_pdfs',
          firmNames: CONSULTING_FIRMS,
          industry: selectedIndustry,
        }),
      });

      if (!researchResponse.ok) {
        throw new Error('Failed to start research');
      }

      const researchData = await researchResponse.json();
      console.log('✅ Research started:', researchData);

      hide();
      message.success(`Research started for ${selectedIndustry}! Analyzing documents from ${CONSULTING_FIRMS.length} consulting firms...`);
      setLoading(false);
      
      // Navigate directly to research page with industry and firms info
      const selectedIndustryLabel = industries.find(i => i.value === selectedIndustry)?.label || selectedIndustry;
      router.push(`/research?industry=${selectedIndustry}&label=${selectedIndustryLabel}&firms=${CONSULTING_FIRMS.join(',')}`);

    } catch (error) {
      hide();
      console.error('❌ Error starting research:', error);
      message.error(`Failed to start research: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
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
            onClick={handleStartResearch}
            icon={<RightOutlined />}
            style={{
              height: '44px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            Start Market Research
          </Button>
        </div>
      )}
    </div>
  );
}