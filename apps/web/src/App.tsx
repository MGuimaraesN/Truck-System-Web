import { Layout, Menu } from 'antd';
import { useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import AbastecimentosPage from '@/pages/Abastecimentos';
import AlertasPage from '@/pages/Alertas';
import DashboardPage from '@/pages/Dashboard';
import DespesasPage from '@/pages/Despesas';
import DocumentosPage from '@/pages/Documentos';
import FretesPage from '@/pages/Fretes';
import LoginPage from '@/pages/Login';
import ManutencoesPage from '@/pages/Manutencoes';
import MotoristasPage from '@/pages/Motoristas';
import PneusPage from '@/pages/Pneus';
import VeiculosPage from '@/pages/Veiculos';
import ViagensPage from '@/pages/Viagens';
import { useAuthStore } from '@/store/auth';

const { Header, Content, Sider } = Layout;

const App = () => {
  const { accessToken, clear, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard', path: '/' },
      { key: 'fretes', label: 'Fretes', path: '/fretes' },
      { key: 'abastecimentos', label: 'Abastecimentos', path: '/abastecimentos' },
      { key: 'manutencoes', label: 'Manutenções', path: '/manutencoes' },
      { key: 'despesas', label: 'Despesas', path: '/despesas', roles: ['admin', 'gestor', 'financeiro'] },
      { key: 'viagens', label: 'Viagens', path: '/viagens', roles: ['admin', 'gestor'] },
      { key: 'motoristas', label: 'Motoristas', path: '/motoristas', roles: ['admin', 'gestor'] },
      { key: 'veiculos', label: 'Veículos', path: '/veiculos', roles: ['admin', 'gestor'] },
      { key: 'pneus', label: 'Pneus', path: '/pneus', roles: ['admin', 'gestor'] },
      { key: 'documentos', label: 'Documentos', path: '/documentos' },
      { key: 'alertas', label: 'Alertas', path: '/alertas' },
    ],
    [],
  );

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  if (!accessToken) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const onMenuClick = ({ key }: { key: string }) => {
    const item = visibleMenuItems.find((menu) => menu.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  const allowedPaths = new Set(visibleMenuItems.map((item) => item.path));

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: '#fff', padding: 16, fontWeight: 700 }}>Frota Sapiens</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[visibleMenuItems.find((item) => location.pathname === item.path)?.key ?? 'dashboard']}
          items={visibleMenuItems.map((item) => ({ key: item.key, label: item.label }))}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', paddingRight: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ marginRight: 16 }}>{user?.role}</span>
          <a
            onClick={() => {
              clear();
              navigate('/login');
            }}
          >
            Sair
          </a>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/fretes" element={allowedPaths.has('/fretes') ? <FretesPage /> : <Navigate to="/" replace />} />
            <Route
              path="/abastecimentos"
              element={allowedPaths.has('/abastecimentos') ? <AbastecimentosPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/manutencoes"
              element={allowedPaths.has('/manutencoes') ? <ManutencoesPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/despesas"
              element={allowedPaths.has('/despesas') ? <DespesasPage /> : <Navigate to="/" replace />}
            />
            <Route path="/viagens" element={allowedPaths.has('/viagens') ? <ViagensPage /> : <Navigate to="/" replace />} />
            <Route path="/motoristas" element={allowedPaths.has('/motoristas') ? <MotoristasPage /> : <Navigate to="/" replace />} />
            <Route path="/veiculos" element={allowedPaths.has('/veiculos') ? <VeiculosPage /> : <Navigate to="/" replace />} />
            <Route path="/pneus" element={allowedPaths.has('/pneus') ? <PneusPage /> : <Navigate to="/" replace />} />
            <Route path="/documentos" element={allowedPaths.has('/documentos') ? <DocumentosPage /> : <Navigate to="/" replace />} />
            <Route path="/alertas" element={allowedPaths.has('/alertas') ? <AlertasPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
