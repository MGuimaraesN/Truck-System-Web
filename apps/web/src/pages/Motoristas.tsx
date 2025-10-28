import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Nome', dataIndex: 'nome', key: 'nome' },
  { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
  { title: 'CNH', dataIndex: 'cnh', key: 'cnh' },
  { title: 'Validade CNH', dataIndex: 'validadeCnh', key: 'validadeCnh' },
];

const formFields = [
  { name: 'nome', label: 'Nome' },
  { name: 'cpf', label: 'CPF' },
  { name: 'cnh', label: 'CNH' },
  { name: 'validadeCnh', label: 'Validade CNH' },
];

const MotoristasPage = () => (
  <ResourceTable resource="motoristas" title="Novo motorista" columns={columns} formFields={formFields} />
);

export default MotoristasPage;
