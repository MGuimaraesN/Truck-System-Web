import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Frete = components['schemas']['Frete'];
type FreteInput = components['schemas']['FreteInput'];

const columns: ColumnsType<Frete> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Origem', dataIndex: 'origem', key: 'origem' },
  { title: 'Destino', dataIndex: 'destino', key: 'destino' },
  { title: 'Valor', dataIndex: 'valorTotal', key: 'valorTotal' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const formFields: FormField<FreteInput>[] = [
  { name: 'veiculoId', label: 'Veículo', component: 'number', required: true },
  { name: 'data', label: 'Data', required: true },
  { name: 'origem', label: 'Origem' },
  { name: 'destino', label: 'Destino' },
  { name: 'valorTotal', label: 'Valor Total', component: 'number' },
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

const FretesPage = () => (
  <ResourceTable<Frete, FreteInput> resource="fretes" title="Novo frete" columns={columns} formFields={formFields} />
);

export default FretesPage;
