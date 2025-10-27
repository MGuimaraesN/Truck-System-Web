import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* Aqui virá o layout principal (Sidebar, Header) */}
      <header>Header do Cockpit</header>
      <aside>Sidebar</aside>
      <main>
        <Outlet /> {/* As rotas filhas (Dashboard, etc.) serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default ProtectedLayout;
