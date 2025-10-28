import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { api } from '@/api/client';
import type { components } from '@/api/generated';
import type { PaginatedResponse } from '@/components/ResourceTable';

type Viagem = components['schemas']['Viagem'];
type ViagemInput = components['schemas']['ViagemInput'];

const ViagensPage = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns: ColumnsType<Viagem> = [
    { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
    { title: 'Início', dataIndex: 'dataInicio', key: 'dataInicio' },
    {
      title: 'Resumo',
      key: 'resumo',
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedId(record.id)}>
          Ver resumo
        </Button>
      ),
    },
  ];

  const { data } = useQuery<PaginatedResponse<Viagem>>({
    queryKey: ['viagens'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Viagem>>('/viagens');
      return data;
    },
  });

  const { data: resumo } = useQuery<components['schemas']['ViagemResumo'] | null>({
    queryKey: ['viagem-resumo', selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const { data } = await api.get<components['schemas']['ViagemResumo']>(`/viagens/${selectedId}/resumo`);
      return data;
    },
    enabled: selectedId !== null,
  });

  const mutation = useMutation<components['schemas']['Viagem'], unknown, ViagemInput>({
    mutationFn: async (values) => {
      const { data } = await api.post<components['schemas']['Viagem']>('/viagens', values);
      return data;
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
      <Table<Viagem>
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={data?.data ?? []}
        rowKey="id"
      />
      <Drawer open={selectedId !== null} onClose={() => setSelectedId(null)} title="Resumo da viagem">
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
