import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Custo', dataIndex: 'custo', key: 'custo' },
];

const formFields = [
  { name: 'veiculoId', label: 'Veículo ID', component: 'number' as const },
  { name: 'data', label: 'Data' },
  { name: 'tipo', label: 'Tipo' },
  { name: 'descricao', label: 'Descrição' },
];

const ManutencoesPage = () => (
  <ResourceTable resource="manutencoes" title="Nova manutenção" columns={columns} formFields={formFields} />
);

export default ManutencoesPage;
