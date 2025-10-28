import { ColumnsType } from 'antd/es/table';

import { ResourceTable } from '@/components/ResourceTable';

const columns: ColumnsType<any> = [
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Vencimento', dataIndex: 'dataVencimento', key: 'dataVencimento' },
];

const formFields = [
  { name: 'veiculoId', label: 'Veículo ID', component: 'number' as const },
  { name: 'tipo', label: 'Tipo' },
  { name: 'dataVencimento', label: 'Data de vencimento' },
];

const DocumentosPage = () => (
  <ResourceTable resource="documentos" title="Novo documento" columns={columns} formFields={formFields} />
);

export default DocumentosPage;
