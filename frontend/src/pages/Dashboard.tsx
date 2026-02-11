import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

interface Veiculo {
  id: number;
  placa: string;
  modelo?: string;
  apelido?: string;
}

const DashboardPage = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    const fetchVeiculos = async () => {
      const { data } = await api.get('/veiculos');
      setVeiculos(data);
    };
    fetchVeiculos();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="vehicle-list">
        {veiculos.map((v) => (
          <Link to={`/veiculo/${v.id}`} key={v.id} className="vehicle-card">
            <h2>{v.apelido || v.placa}</h2>
            <p>{v.modelo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
