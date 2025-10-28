import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Placa', dataIndex: 'placa', key: 'placa' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Ativo', dataIndex: 'ativo', key: 'ativo' },
];

const formFields = [
  { name: 'placa', label: 'Placa' },
  { name: 'descricao', label: 'Descrição' },
];

const VeiculosPage = () => (
  <ResourceTable resource="veiculos" title="Novo veículo" columns={columns} formFields={formFields} />
);

export default VeiculosPage;
