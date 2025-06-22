'use client';

import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface PhaseBreadcrumbsProps {
  current: string;
}

const phaseMap: Record<string, string> = {
  industry: 'Industry Selection',
  consulting: 'Consulting Group',
  research: 'Document Research',
  gaps: 'Market Gaps',
  audience: 'Audience Insights',
  problems: 'Problem Selection',
  solutions: 'Solution Development',
  competitors: 'Competitor Analysis',
  hackathon: 'Hackathon Optimization',
  'tech-stack': 'Technology Stack',
  summary: 'Project Summary',
};

export function PhaseBreadcrumbs({ current }: PhaseBreadcrumbsProps) {
  return (
    <Breadcrumb
      items={[
        {
          href: '/',
          title: <HomeOutlined />,
        },
        {
          title: phaseMap[current] || current,
        },
      ]}
    />
  );
}