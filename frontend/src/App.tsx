import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import ProtectedLayout from './components/layouts/ProtectedLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Redireciona com base no estado de autenticação */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Rotas Públicas (Autenticação) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rotas Protegidas (Aplicação Principal) */}
        <Route path="/app" element={<ProtectedLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Outras rotas da aplicação virão aqui (ex: receitas, despesas) */}
        </Route>

        {/* Rota Not Found */}
        <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
