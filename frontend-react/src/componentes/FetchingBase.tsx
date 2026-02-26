import { useEffect, useState } from 'react';
import type { PersonajeCard } from '../types';
import { API_BASE } from '../constants';

export default function FetchingBase() {
  const [personajes, setPersonajes] = useState<PersonajeCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/characters/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPersonajes(data.status);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando personajes…</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;

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
