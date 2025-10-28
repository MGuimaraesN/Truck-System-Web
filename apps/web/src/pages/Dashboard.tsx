import { Card, Col, Row, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Line } from '@ant-design/charts';

import { api } from '@/api/client';

const DashboardPage = () => {
  const { data } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const { data } = await api.get('/dashboards/kpis');
      return data;
    },
  });

  const items = [
    { title: 'Receita', value: data?.receita ?? 0 },
    { title: 'Custo total', value: data?.custoTotal ?? 0 },
    { title: 'Lucro', value: data?.lucro ?? 0 },
    { title: 'Margem', value: ((data?.margem ?? 0) * 100).toFixed(1) + '%' },
  ];

  const chartData = [
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
