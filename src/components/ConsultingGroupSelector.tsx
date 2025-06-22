'use client';

import { Select, Button, Row, Col, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RightOutlined } from '@ant-design/icons';
import { getConsultingGroups } from '@/utils/api';
import type { ConsultingGroup } from '@/types';

export function ConsultingGroupSelector() {
  const [groups, setGroups] = useState<ConsultingGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await getConsultingGroups();
        setGroups(data);
      } catch (error) {
        message.error('Failed to load consulting groups');
      } finally {
        setInitialLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleNext = async () => {
    if (!selectedGroup) {
      message.error('Please select a consulting group');
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

      // Step 2: Start PDF crawling
      console.log('📄 Starting PDF crawling...');
      
      // Get the selected consulting group details
      const selectedGroupData = groups.find(g => g.id === selectedGroup);
      const firmNames = selectedGroupData ? [selectedGroupData.name] : ['McKinsey & Company'];
      
      const researchResponse = await fetch('/api/agents/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'crawl_pdfs',
          firmNames: firmNames,
        }),
      });

      if (!researchResponse.ok) {
        throw new Error('Failed to start research');
      }

      const researchData = await researchResponse.json();
      console.log('✅ Research started:', researchData);

      hide();
      message.success('Research started successfully! Analyzing documents...');
      setLoading(false);
      
      // Navigate to research page with selected group info
      router.push(`/research?group=${selectedGroup}&firms=${firmNames.join(',')}`);

    } catch (error) {
      hide();
      console.error('❌ Error starting research:', error);
      message.error(`Failed to start research: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Select
          size="large"
          placeholder="Select a consulting group"
          style={{ width: '100%' }}
          value={selectedGroup}
          onChange={setSelectedGroup}
          options={groups.map(group => ({
            value: group.id,
            label: `${group.name} (${group.reports} reports)`,
          }))}
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
          disabled={!selectedGroup}
          aria-label="Start document analysis"
        >
          Start Document Analysis
        </Button>
      </Col>
    </Row>
  );
}