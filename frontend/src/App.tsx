import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/auth';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import VehicleDetailsPage from './pages/VehicleDetails';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/veiculo/:id"
          element={
            <PrivateRoute>
              <VehicleDetailsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
