import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Despesa = components['schemas']['Despesa'];
type DespesaInput = components['schemas']['DespesaInput'];

const columns: ColumnsType<Despesa> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Valor', dataIndex: 'valor', key: 'valor' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const formFields: FormField<DespesaInput>[] = [
  { name: 'veiculoId', label: 'Veículo', component: 'number', required: true },
  { name: 'data', label: 'Data', required: true },
  { name: 'categoria', label: 'Categoria' },
  { name: 'descricao', label: 'Descrição' },
  { name: 'valor', label: 'Valor', component: 'number', required: true },
  {
    name: 'status',
    label: 'Status',
    component: 'select',
    options: [
      { label: 'Pendente', value: 'PENDENTE' },
      { label: 'Pago', value: 'PAGO' },
      { label: 'Recebido', value: 'RECEBIDO' },
    ],
  },
];

const DespesasPage = () => (
  <ResourceTable<Despesa, DespesaInput> resource="despesas" title="Nova despesa" columns={columns} formFields={formFields} />
);

export default DespesasPage;
