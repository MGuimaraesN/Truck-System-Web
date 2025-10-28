import { Button, Drawer, Table } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/client';

const ViagensPage = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data } = useQuery({
    queryKey: ['viagens'],
    queryFn: async () => {
      const { data } = await api.get('/viagens');
      return data;
    },
  });

  const { data: resumo } = useQuery({
    queryKey: ['viagem-resumo', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const { data } = await api.get(`/viagens/${selectedId}/resumo`);
      return data;
    },
    enabled: !!selectedId,
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await api.post('/viagens', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viagens'] });
    },
  });

  return (
    <div>
      <Button
        type="primary"
        onClick={() =>
          mutation.mutate({
            descricao: 'Nova viagem',
            dataInicio: new Date().toISOString(),
            veiculoId: 1,
            motoristaId: 1,
          })
        }
      >
        Criar viagem
      </Button>
      <Table
        style={{ marginTop: 16 }}
        columns={[
          { title: 'Descrição', dataIndex: 'descricao' },
          { title: 'Início', dataIndex: 'dataInicio' },
          {
            title: 'Resumo',
            render: (_, record) => (
              <Button type="link" onClick={() => setSelectedId(record.id)}>
                Ver resumo
              </Button>
            ),
          },
        ]}
        dataSource={data?.data ?? data}
        rowKey="id"
      />
      <Drawer open={!!selectedId} onClose={() => setSelectedId(null)} title="Resumo da viagem">
        {resumo ? (
          <pre>{JSON.stringify(resumo, null, 2)}</pre>
        ) : (
          <p>Selecione uma viagem para ver o resumo.</p>
        )}
      </Drawer>
    </div>
  );
};

export default ViagensPage;
