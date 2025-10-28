import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Abastecimento = components['schemas']['Abastecimento'];
type AbastecimentoInput = components['schemas']['AbastecimentoInput'];

const columns: ColumnsType<Abastecimento> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Posto', dataIndex: 'posto', key: 'posto' },
  { title: 'Litros', dataIndex: 'litros', key: 'litros' },
  { title: 'Valor Total', dataIndex: 'valorTotal', key: 'valorTotal' },
  { title: 'KM Atual', dataIndex: 'kmAtual', key: 'kmAtual' },
];

const formFields: FormField<AbastecimentoInput>[] = [
  { name: 'veiculoId', label: 'Veículo', component: 'number', required: true },
  { name: 'data', label: 'Data', required: true },
  { name: 'posto', label: 'Posto' },
  { name: 'litros', label: 'Litros', component: 'number', required: true },
  { name: 'kmAtual', label: 'KM Atual', component: 'number', required: true },
  { name: 'valorTotal', label: 'Valor Total', component: 'number' },
];

const AbastecimentosPage = () => (
  <ResourceTable<Abastecimento, AbastecimentoInput>
    resource="abastecimentos"
    title="Novo abastecimento"
    columns={columns}
    formFields={formFields}
  />
);

export default AbastecimentosPage;
