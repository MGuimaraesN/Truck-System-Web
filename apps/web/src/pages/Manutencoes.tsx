import type { ColumnsType } from 'antd/es/table';

import type { components } from '@/api/generated';
import { ResourceTable, type FormField } from '@/components/ResourceTable';

type Manutencao = components['schemas']['Manutencao'];
type ManutencaoInput = components['schemas']['ManutencaoInput'];

const columns: ColumnsType<Manutencao> = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
  { title: 'Custo', dataIndex: 'custo', key: 'custo' },
  { title: 'KM Atual', dataIndex: 'kmAtual', key: 'kmAtual' },
];

const formFields: FormField<ManutencaoInput>[] = [
  { name: 'veiculoId', label: 'Veículo', component: 'number', required: true },
  { name: 'data', label: 'Data', required: true },
  { name: 'tipo', label: 'Tipo', required: true },
  { name: 'descricao', label: 'Descrição' },
  { name: 'custo', label: 'Custo', component: 'number' },
  { name: 'kmAtual', label: 'KM Atual', component: 'number' },
  { name: 'kmProximaTroca', label: 'Próxima troca (KM)', component: 'number' },
];

const ManutencoesPage = () => (
  <ResourceTable<Manutencao, ManutencaoInput>
    resource="manutencoes"
    title="Nova manutenção"
    columns={columns}
    formFields={formFields}
  />
);

export default ManutencoesPage;
