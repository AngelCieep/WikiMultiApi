import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { UniversoDetail as IUniversoDetail, PersonajeCard } from '../types';
import PersonajeCardComponent from './PersonajeCard';
import { API_BASE } from '../constants';

export default function UniversoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [universo, setUniverso] = useState<IUniversoDetail | null>(null);
  const [personajes, setPersonajes] = useState<PersonajeCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPersonajes, setLoadingPersonajes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/universes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUniverso(data.status);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingPersonajes(true);
    fetch(`${API_BASE}/characters/universe/${id}`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.status)) setPersonajes(data.status);
        setLoadingPersonajes(false);
      })
      .catch(() => setLoadingPersonajes(false));
  }, [id]);

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando universo...</p>
      </div>
    );

  if (error)
    return (
      <div className="container my-5">
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill fs-4" />
          <div><strong>Error:</strong> {error}</div>
        </div>
        <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2" />Volver
        </button>
      </div>
    );

  if (!universo)
    return (
      <div className="container my-5">
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <i className="bi bi-question-circle-fill fs-4" />
          Universo no encontrado.
        </div>
        <button className="btn btn-outline-dark" onClick={() => navigate('/')}>
          <i className="bi bi-house me-2" />Inicio
        </button>
      </div>
    );

  return (
    <>
      <div
        className="text-white py-5 mb-4"
        style={{
          background: universo.backgroundImage
            ? `linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.7)), url(${universo.backgroundImage}) center/cover no-repeat`
            : universo.primaryColor
            ? `linear-gradient(135deg, ${universo.primaryColor}, #000)`
            : 'linear-gradient(135deg, #1a1a2e, #16213e)',
          minHeight: '280px',
        }}
      >
        <div className="container pt-5">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button className="btn btn-link p-0 text-white text-opacity-75 text-decoration-none" onClick={() => navigate('/')}>
                  <i className="bi bi-house me-1" />Inicio
                </button>
              </li>
              <li className="breadcrumb-item active text-white">{universo.name}</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center gap-3 mt-2">
            {universo.logo && (
              <img
                src={universo.logo}
                alt={`Logo ${universo.name}`}
                className="rounded-3"
                style={{ maxHeight: '80px', maxWidth: '120px', objectFit: 'contain' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div>
              <h1 className="display-5 fw-bold mb-2">{universo.name}</h1>
              <div className="d-flex flex-wrap gap-2">
                <span className={`badge rounded-pill ${universo.isActive ? 'bg-success' : 'bg-secondary'}`}>
                  <i className={`bi ${universo.isActive ? 'bi-check-circle' : 'bi-x-circle'} me-1`} />
                  {universo.isActive ? 'Activo' : 'Inactivo'}
                </span>
                <span className="badge bg-warning text-dark rounded-pill">
                  <i className="bi bi-star-fill me-1" />Popularidad: {universo.popularityScore}
                </span>
                <span className="badge bg-info text-dark rounded-pill">
                  <i className="bi bi-calendar me-1" />
                  {new Date(universo.releaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        {universo.description && (
          <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
            <p className="mb-0 text-secondary">{universo.description}</p>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-people-fill me-2 text-primary" />Personajes del universo
          </h4>
          {!loadingPersonajes && (
            <span className="badge bg-primary rounded-pill px-3 py-2">{personajes.length}</span>
          )}
        </div>

        {loadingPersonajes && (
          <div className="d-flex align-items-center gap-2 text-muted py-3">
            <div className="spinner-border spinner-border-sm" role="status" />
            Cargando personajes...
          </div>
        )}

        {!loadingPersonajes && personajes.length === 0 && (
          <div className="alert alert-info d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill fs-5" />
            No hay personajes registrados para este universo.
          </div>
        )}

        {!loadingPersonajes && personajes.length > 0 && (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
            {personajes.map((p) => (
              <div className="col" key={p._id}>
                <PersonajeCardComponent personaje={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
