'use client';

import { Select, Button, Row, Col, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RightOutlined } from '@ant-design/icons';
import { CONSULTING_FIRMS } from '@/constants';
import type { ConsultingGroup } from '@/types';

export function ConsultingGroupSelector() {
  const [groups, setGroups] = useState<ConsultingGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Convert CONSULTING_FIRMS to the expected format
    const groupsData = CONSULTING_FIRMS.map((name, index) => ({
      id: String(index + 1),
      name,
      reports: Math.floor(Math.random() * 50) + 10, // Mock report count
      description: `Leading global consulting firm specializing in strategic advisory services`, // Add required description
    }));
    setGroups(groupsData);
    setInitialLoading(false);
  }, []);

  const handleNext = async () => {
    if (!selectedGroup) {
      message.error('Please select a consulting group');
      return;
    }

    setLoading(true);
    const hide = message.loading('Initializing agents and starting research...', 0);

    try {
      // Step 1: Initialize simplified orchestrator
      console.log('🚀 Initializing simplified orchestrator...');
      const initResponse = await fetch('/api/simple-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' }),
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize orchestrator');
      }

      const initData = await initResponse.json();
      console.log('✅ Orchestrator initialized:', initData);

      // Step 2: Start workflow with selected consulting group
      console.log('📄 Starting workflow...');
      
      // Get the selected consulting group details
      const selectedGroupData = groups.find(g => g.id === selectedGroup);
      
      const workflowResponse = await fetch('/api/simple-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_workflow',
          consulting_group: selectedGroupData?.name || 'McKinsey & Company',
        }),
      });

      if (!workflowResponse.ok) {
        throw new Error('Failed to start workflow');
      }

      const workflowData = await workflowResponse.json();
      console.log('✅ Workflow started:', workflowData);

      hide();
      message.success('Workflow started successfully!');
      setLoading(false);
      
      // Navigate to simplified test page
      router.push('/simple');

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