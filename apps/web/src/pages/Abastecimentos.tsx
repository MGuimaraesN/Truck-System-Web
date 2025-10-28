import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Posto', dataIndex: 'posto', key: 'posto' },
  { title: 'Litros', dataIndex: 'litros', key: 'litros' },
  { title: 'Valor Total', dataIndex: 'valorTotal', key: 'valorTotal' },
];

const formFields = [
  { name: 'veiculoId', label: 'Veículo ID', component: 'number' as const },
  { name: 'data', label: 'Data' },
  { name: 'posto', label: 'Posto' },
  { name: 'litros', label: 'Litros', component: 'number' as const },
  { name: 'kmAtual', label: 'KM Atual', component: 'number' as const },
];

const AbastecimentosPage = () => (
  <ResourceTable resource="abastecimentos" title="Novo abastecimento" columns={columns} formFields={formFields} />
);

export default AbastecimentosPage;
