import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Pneu = components['schemas']['Pneu'];
type PneuInput = components['schemas']['PneuInput'];

const columns: ColumnsType<Pneu> = [
  { title: 'Número de série', dataIndex: 'numSerie', key: 'numSerie' },
  { title: 'Marca', dataIndex: 'marca', key: 'marca' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Valor de compra', dataIndex: 'valorCompra', key: 'valorCompra' },
];

const formFields: FormField<PneuInput>[] = [
  { name: 'numSerie', label: 'Número de série', required: true },
  { name: 'marca', label: 'Marca', required: true },
  { name: 'modelo', label: 'Modelo' },
  { name: 'valorCompra', label: 'Valor de compra', component: 'number', required: true },
  { name: 'dataCompra', label: 'Data de compra', required: true },
  {
    name: 'status',
    label: 'Status',
    component: 'select',
    options: [
      { label: 'Novo', value: 'NOVO' },
      { label: 'Em uso', value: 'EM_USO' },
      { label: 'Reformado', value: 'REFORMADO' },
      { label: 'Descartado', value: 'DESCARTADO' },
    ],
  },
];

const PneusPage = () => (
  <ResourceTable<Pneu, PneuInput> resource="pneus" title="Novo pneu" columns={columns} formFields={formFields} />
);

export default PneusPage;
