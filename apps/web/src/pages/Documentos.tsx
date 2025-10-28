import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Documento = components['schemas']['Documento'];
type DocumentoInput = components['schemas']['DocumentoInput'];

const columns: ColumnsType<Documento> = [
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Vencimento', dataIndex: 'dataVencimento', key: 'dataVencimento' },
];

const formFields: FormField<DocumentoInput>[] = [
  { name: 'veiculoId', label: 'Veículo', component: 'number', required: true },
  { name: 'tipo', label: 'Tipo', required: true },
  { name: 'descricao', label: 'Descrição' },
  { name: 'dataVencimento', label: 'Data de vencimento', required: true },
];

const DocumentosPage = () => (
  <ResourceTable<Documento, DocumentoInput>
    resource="documentos"
    title="Novo documento"
    columns={columns}
    formFields={formFields}
  />
);

export default DocumentosPage;
