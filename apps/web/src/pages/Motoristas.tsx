import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Motorista = components['schemas']['Motorista'];
type MotoristaInput = components['schemas']['MotoristaInput'];

const columns: ColumnsType<Motorista> = [
  { title: 'Nome', dataIndex: 'nome', key: 'nome' },
  { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
  { title: 'CNH', dataIndex: 'cnh', key: 'cnh' },
  { title: 'Validade CNH', dataIndex: 'validadeCnh', key: 'validadeCnh' },
];

const formFields: FormField<MotoristaInput>[] = [
  { name: 'nome', label: 'Nome', required: true },
  { name: 'cpf', label: 'CPF', required: true },
  { name: 'cnh', label: 'CNH', required: true },
  { name: 'validadeCnh', label: 'Validade CNH', required: true },
];

const MotoristasPage = () => (
  <ResourceTable<Motorista, MotoristaInput>
    resource="motoristas"
    title="Novo motorista"
    columns={columns}
    formFields={formFields}
  />
);

export default MotoristasPage;
