'use client';

import { Card, Checkbox, Typography, Space, Tag } from 'antd';
import { useState } from 'react';
import { TrophyOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CategoriesPickerProps {
  hackathonData: any;
}

export function CategoriesPicker({ hackathonData }: CategoriesPickerProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock categories data
  const categories = [
    {
      id: 'main-prize',
      name: 'Main Prize',
      prize: '$10,000',
      description: 'Grand prize for the best overall submission',
      requirements: ['Must be a working prototype', 'Include business plan'],
    },
    {
      id: 'fintech',
      name: 'Best FinTech Solution',
      prize: '$5,000',
      description: 'Best solution addressing financial technology challenges',
      requirements: ['Must use financial APIs', 'Address real financial problem'],
    },
    {
      id: 'sustainability',
      name: 'Sustainability Track',
      prize: '$3,000',
      description: 'Solutions that promote environmental sustainability',
      requirements: ['Demonstrate environmental impact', 'Include sustainability metrics'],
    },
    {
      id: 'student',
      name: 'Best Student Project',
      prize: '$2,000',
      description: 'For teams composed entirely of students',
      requirements: ['All team members must be students', 'Provide student verification'],
    },
  ];

  const onChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>
          <TrophyOutlined style={{ marginRight: 8 }} />
          Available Prize Categories
        </Title>
        <Text type="secondary">
          Select the categories you want to compete in. We'll optimize your solution accordingly.
        </Text>
      </Card>

      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={onChange}
        value={selectedCategories}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {categories.map(category => (
            <Card
              key={category.id}
              hoverable
              style={{
                cursor: 'pointer',
                border: selectedCategories.includes(category.id) 
                  ? '2px solid #1677ff' 
                  : '1px solid #d9d9d9',
              }}
              onClick={() => {
                const newSelection = selectedCategories.includes(category.id)
                  ? selectedCategories.filter(id => id !== category.id)
                  : [...selectedCategories, category.id];
                setSelectedCategories(newSelection);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <Checkbox
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {category.name}
                    </Title>
                    <Tag icon={<DollarOutlined />} color="gold">
                      {category.prize}
                    </Tag>
                  </div>
                  
                  <Text style={{ display: 'block', marginBottom: 12 }}>
                    {category.description}
                  </Text>
                  
                  <div>
                    <Text strong style={{ fontSize: '12px' }}>Requirements:</Text>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      {category.requirements.map((req, index) => (
                        <li key={index} style={{ fontSize: '12px', color: '#666' }}>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  );
}