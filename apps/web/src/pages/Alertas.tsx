import { useQuery } from '@tanstack/react-query';
import { Card, Col, List, Row } from 'antd';

import { api } from '@/api/client';
import type { components } from '@/api/generated';

const AlertasPage = () => {
  const { data } = useQuery<components['schemas']['AlertasResumo']>({
    queryKey: ['alertas'],
    queryFn: async () => {
      const { data } = await api.get('/alertas');
      return data;
    },
  });

  type DocumentoAlerta = components['schemas']['AlertasResumo']['documentosVencendo'][number];
  type ManutencaoAlerta = components['schemas']['AlertasResumo']['manutencoesProximas'][number];
  type CnhAlerta = components['schemas']['AlertasResumo']['cnhVencendo'][number];

  const documentos = data?.documentosVencendo ?? [];
  const manutencoes = data?.manutencoesProximas ?? [];
  const cnh = data?.cnhVencendo ?? [];

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Documentos">
          <List<DocumentoAlerta>
            dataSource={documentos}
            renderItem={(item) => (
              <List.Item>
                {item.tipo} - {item.dataVencimento}
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Manutenções">
          <List<ManutencaoAlerta>
            dataSource={manutencoes}
            renderItem={(item) => (
              <List.Item>
                {item.tipo} - {item.kmAtual ?? 0} km
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="CNH">
          <List<CnhAlerta>
            dataSource={cnh}
            renderItem={(item) => (
              <List.Item>
                {item.nome} - {item.validadeCnh}
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AlertasPage;
