import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Número de série', dataIndex: 'numSerie', key: 'numSerie' },
  { title: 'Marca', dataIndex: 'marca', key: 'marca' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const formFields = [
  { name: 'numSerie', label: 'Número de série' },
  { name: 'marca', label: 'Marca' },
  { name: 'valorCompra', label: 'Valor de compra', component: 'number' as const },
  { name: 'dataCompra', label: 'Data de compra' },
];

const PneusPage = () => <ResourceTable resource="pneus" title="Novo pneu" columns={columns} formFields={formFields} />;

export default PneusPage;
