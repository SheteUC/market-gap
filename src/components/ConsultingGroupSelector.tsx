'use client';

import { Select, Button, Row, Col, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RightOutlined } from '@ant-design/icons';
import { getConsultingGroups } from '@/utils/api';
import type { ConsultingGroup } from '@/types';

export function ConsultingGroupSelector() {
  const [groups, setGroups] = useState<ConsultingGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

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
    const hide = message.loading('Processing selection...', 0);

    setTimeout(() => {
      hide();
      message.success('Consulting group selected successfully');
      setLoading(false);
      router.push('/research');
    }, 1500);
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