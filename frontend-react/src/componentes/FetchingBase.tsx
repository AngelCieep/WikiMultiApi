import { useEffect, useState } from 'react';
import type { PersonajeCard } from '../types';
import { validateAPIResponse, validatePersonajeCard } from '../types/validators';
import { Spinner, Alert } from './common';
import { API_BASE_URL } from '../App';

export default function FetchingBase() {
  const [personajes, setPersonajes] = useState<PersonajeCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/characters/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        try {
          const validated = validateAPIResponse(data, validatePersonajeCard);
          setPersonajes(validated.status);
          setLoading(false);
        } catch (validationError) {
          throw new Error(`Datos inválidos: ${validationError instanceof Error ? validationError.message : 'Error desconocido'}`);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="lg" message="Cargando personajes..." />;
  if (error)
    return (
      <div className="container my-5">
        <Alert type="danger" title="Error:" message={error} />
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Personajes ({personajes.length})</h2>
      <ul className="list-group">
        {personajes.map((p) => (
          <li key={p._id} className="list-group-item">
            {p.name} {p.title && <small className="text-muted">— {p.title}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}
