import { Line } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic } from 'antd';

import { api } from '@/api/client';
import type { components } from '@/api/generated';

const DashboardPage = () => {
  const { data } = useQuery<components['schemas']['DashboardResumo']>({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const { data } = await api.get('/dashboards/kpis');
      return data;
    },
  });

  const items: Array<{ title: string; value: number | string }> = [
    { title: 'Receita', value: data?.receita ?? 0 },
    { title: 'Custo total', value: data?.custoTotal ?? 0 },
    { title: 'Lucro', value: data?.lucro ?? 0 },
    { title: 'Margem', value: ((data?.margem ?? 0) * 100).toFixed(1) + '%' },
  ];

  const chartData: Array<{ category: string; value: number }> = [
    { category: 'Receita', value: data?.receita ?? 0 },
    { category: 'Custos', value: data?.custoTotal ?? 0 },
  ];

  return (
    <div>
      <Row gutter={16}>
        {items.map((item) => (
          <Col key={item.title} xs={24} md={6}>
            <Card>
              <Statistic title={item.title} value={item.value} precision={2} prefix={item.title === 'Margem' ? '' : 'R$'} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Receita vs Custos" style={{ marginTop: 24 }}>
        <Line data={chartData} xField="category" yField="value" autoFit />
      </Card>
    </div>
  );
};

export default DashboardPage;
