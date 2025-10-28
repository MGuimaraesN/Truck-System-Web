import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Veiculo = components['schemas']['Veiculo'];
type VeiculoInput = components['schemas']['VeiculoInput'];

const columns: ColumnsType<Veiculo> = [
  { title: 'Placa', dataIndex: 'placa', key: 'placa' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  {
    title: 'Ativo',
    dataIndex: 'ativo',
    key: 'ativo',
    render: (value: Veiculo['ativo']) => (value ? 'Sim' : 'Não'),
  },
];

const formFields: FormField<VeiculoInput>[] = [
  { name: 'placa', label: 'Placa', required: true },
  { name: 'descricao', label: 'Descrição', required: true },
  {
    name: 'ativo',
    label: 'Status',
    component: 'select',
    options: [
      { label: 'Ativo', value: true },
      { label: 'Inativo', value: false },
    ],
  },
];

const VeiculosPage = () => (
  <ResourceTable<Veiculo, VeiculoInput> resource="veiculos" title="Novo veículo" columns={columns} formFields={formFields} />
);

export default VeiculosPage;
