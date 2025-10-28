import { Card, Col, List, Row } from 'antd';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/client';

const AlertasPage = () => {
  const { data } = useQuery({
    queryKey: ['alertas'],
    queryFn: async () => {
      const { data } = await api.get('/alertas');
      return data;
    },
  });

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Documentos">
          <List dataSource={data?.documentosVencendo ?? []} renderItem={(item: any) => <List.Item>{item.tipo} - {item.dataVencimento}</List.Item>} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Manutenções">
          <List dataSource={data?.manutencoesProximas ?? []} renderItem={(item: any) => <List.Item>{item.tipo} - {item.kmAtual} km</List.Item>} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="CNH">
          <List dataSource={data?.cnhVencendo ?? []} renderItem={(item: any) => <List.Item>{item.nome} - {item.validadeCnh}</List.Item>} />
        </Card>
      </Col>
    </Row>
  );
};

export default AlertasPage;
