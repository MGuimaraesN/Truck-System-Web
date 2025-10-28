import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Valor', dataIndex: 'valor', key: 'valor' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const formFields = [
  { name: 'veiculoId', label: 'Veículo ID', component: 'number' as const },
  { name: 'data', label: 'Data' },
  { name: 'descricao', label: 'Descrição' },
  { name: 'valor', label: 'Valor', component: 'number' as const },
];

const DespesasPage = () => (
  <ResourceTable resource="despesas" title="Nova despesa" columns={columns} formFields={formFields} />
);

export default DespesasPage;
