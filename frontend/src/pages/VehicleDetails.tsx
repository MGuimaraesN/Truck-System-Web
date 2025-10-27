import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './VehicleDetails.css';

interface Veiculo {
  id: number;
  placa: string;
  modelo?: string;
  apelido?: string;
  fretes: any[];
  abastecimentos: any[];
  manutencoes: any[];
  despesas: any[];
}

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);

  useEffect(() => {
    const fetchVeiculo = async () => {
      const { data } = await api.get(`/veiculos/${id}`);
      setVeiculo(data);
    };
    fetchVeiculo();
  }, [id]);

  if (!veiculo) return <div>Loading...</div>;

  return (
    <div className="vehicle-details-container">
      <h1>{veiculo.apelido || veiculo.placa}</h1>
      <p>{veiculo.modelo}</p>

      <div className="details-section">
        <h2>Fretes</h2>
        {/* Render fretes list here */}
      </div>

      <div className="details-section">
        <h2>Abastecimentos</h2>
        {/* Render abastecimentos list here */}
      </div>

      <div className="details-section">
        <h2>Manutenções</h2>
        {/* Render manutenções list here */}
      </div>

      <div className="details-section">
        <h2>Despesas</h2>
        {/* Render despesas list here */}
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
