import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Origem', dataIndex: 'origem', key: 'origem' },
  { title: 'Destino', dataIndex: 'destino', key: 'destino' },
  { title: 'Valor', dataIndex: 'valorTotal', key: 'valorTotal' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const formFields = [
  { name: 'veiculoId', label: 'Veículo ID', component: 'number' as const },
  { name: 'data', label: 'Data' },
  { name: 'origem', label: 'Origem' },
  { name: 'destino', label: 'Destino' },
  { name: 'valorTotal', label: 'Valor Total', component: 'number' as const },
];

const FretesPage = () => <ResourceTable resource="fretes" title="Novo frete" columns={columns} formFields={formFields} />;

export default FretesPage;
