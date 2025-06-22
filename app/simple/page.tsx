'use client';

import React, { useState } from 'react';
import { Button, Card, Select, Spin, Alert, Typography, Space, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function SimplePage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const industries = [
    'FinTech',
    'HealthTech', 
    'EdTech',
    'Climate Tech',
    'AI/ML',
    'E-commerce',
    'SaaS'
  ];

  const handleInitialize = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' })
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus(result.data);
        console.log('✅ Orchestrator initialized:', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkflow = async () => {
    if (!selectedIndustry) {
      setError('Please select an industry first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'start_workflow',
          industry: selectedIndustry 
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setWorkflowResult(result.data);
        console.log('✅ Workflow started:', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/simple-workflow?action=status');
      const result = await response.json();
      
      if (result.success) {
        setStatus(result.data);
        console.log('✅ Status retrieved:', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={1}>🎯 MarketGap AI - Simplified (Letta-Native)</Title>
      
      <Paragraph>
        This is a simplified implementation that follows Letta best practices:
      </Paragraph>
      
      <ul>
        <li><strong>Manager-Worker Pattern:</strong> Single Orchestrator Agent manages worker agents</li>
        <li><strong>Shared Memory Blocks:</strong> All agents share state via Letta's native memory system</li>
        <li><strong>Built-in Tools:</strong> Using Letta's native multi-agent communication tools</li>
        <li><strong>Exact Workflow:</strong> Following the cursor rules sequence precisely</li>
      </ul>

      <Divider />

      {error && (
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          closable 
          onClose={() => setError('')}
          style={{ marginBottom: 16 }}
        />
      )}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* Step 1: Initialize */}
        <Card title="Step 1: Initialize Orchestrator Agent">
          <Space>
            <Button 
              type="primary" 
              onClick={handleInitialize}
              loading={loading}
            >
              Initialize Orchestrator
            </Button>
            <Button onClick={handleGetStatus} loading={loading}>
              Get Status
            </Button>
          </Space>
          
          {status && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Status:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* Step 2: Select Industry & Start Workflow */}
        <Card title="Step 2: Start MarketGap Workflow">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Select Industry:</Text>
              <Select
                style={{ width: 200, marginLeft: 12 }}
                placeholder="Choose industry"
                value={selectedIndustry}
                onChange={setSelectedIndustry}
              >
                {industries.map(industry => (
                  <Option key={industry} value={industry}>
                    {industry}
                  </Option>
                ))}
              </Select>
            </div>

            <Button 
              type="primary" 
              onClick={handleStartWorkflow}
              loading={loading}
              disabled={!selectedIndustry}
            >
              Start Workflow for {selectedIndustry}
            </Button>
          </Space>

          {workflowResult && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Workflow Result:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {JSON.stringify(workflowResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card title="ℹ️ How This Works" type="inner">
          <Paragraph>
            <strong>Simplified Architecture:</strong>
          </Paragraph>
          <ol>
            <li><strong>Single Orchestrator Agent:</strong> Creates and manages all worker agents using Letta's built-in tools</li>
            <li><strong>Shared Memory Blocks:</strong> All agents access the same memory blocks defined in cursor rules</li>
            <li><strong>Native Communication:</strong> Uses <code>send_message_to_agent_async</code> and <code>send_message_to_agent_and_wait_for_reply</code></li>
            <li><strong>Exact Workflow Sequence:</strong> Follows the 8-step workflow from cursor rules precisely</li>
          </ol>
          
          <Paragraph>
            <strong>Memory Blocks Created:</strong> consulting_groups, consulting_docs, gap_list, audience_signals, problem_queue, user_feedback, idea_history, final_ideas
          </Paragraph>
        </Card>

      </Space>

      {loading && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.3)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
} 