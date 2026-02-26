import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { UniversoDetail as IUniversoDetail, PersonajeCard } from '../types';
import { validateSingleAPIResponse, validateAPIResponse, validateUniversoDetail, validatePersonajeCard } from '../types/validators';
import PersonajeCardComponent from './PersonajeCard';
import { Spinner, Alert } from './common';
import { API_BASE_URL } from '../App';

export default function UniversoDetail() {
  const { id } = useParams<{ id: string }>();

  const [universo, setUniverso] = useState<IUniversoDetail | null>(null);
  const [personajes, setPersonajes] = useState<PersonajeCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPersonajes, setLoadingPersonajes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [order, setOrder] = useState<string>('desc');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/universes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        try {
          const validated = validateSingleAPIResponse(data, validateUniversoDetail);
          setUniverso(validated.status);
          setLoading(false);
        } catch (validationError) {
          throw new Error(`Datos del universo inválidos: ${validationError instanceof Error ? validationError.message : 'Error desconocido'}`);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingPersonajes(true);
    fetch(`${API_BASE_URL}/characters/universe/${id}`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          try {
            const validated = validateAPIResponse(data, validatePersonajeCard);
            // Ordenar personajes según sortBy y order
            const sorted = [...validated.status].sort((a, b) => {
              let comparison = 0;
              
              if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
              } else if (sortBy === 'views') {
                comparison = (a.views || 0) - (b.views || 0);
              } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                const dateA = new Date(a[sortBy] || 0).getTime();
                const dateB = new Date(b[sortBy] || 0).getTime();
                comparison = dateA - dateB;
              }
              
              return order === 'asc' ? comparison : -comparison;
            });
            
            setPersonajes(sorted);
          } catch (validationError) {
            console.error('Error validando personajes:', validationError);
            setPersonajes([]);
          }
        }
        setLoadingPersonajes(false);
      })
      .catch(() => setLoadingPersonajes(false));
  }, [id, sortBy, order]);

  if (loading) return <Spinner size="lg" message="Cargando universo..." />;

  if (error)
    return (
      <div className="container my-5">
        <Alert type="danger" title="Error:" message={error} />
        <a href="/" className="btn btn-outline-dark">
          <i className="bi bi-house me-2" />Inicio
        </a>
      </div>
    );

  if (!universo)
    return (
      <div className="container my-5">
        <Alert type="warning" message="Universo no encontrado." />
        <a href="/" className="btn btn-outline-dark">
          <i className="bi bi-house me-2" />Inicio
        </a>
      </div>
    );

  // Estilos dinámicos del universo
  const primaryColor = universo.primaryColor || '#0d6efd';
  const fontFamily = universo.fontFamily || 'system-ui, -apple-system, sans-serif';

  return (
    <div style={{ fontFamily }}>
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
                <a href="/" className="text-white text-opacity-75 text-decoration-none">
                  <i className="bi bi-house me-1" />Inicio
                </a>
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
          <div 
            className="card shadow-sm rounded-4 mb-4 p-4 border-start border-4"
            style={{ borderLeftColor: primaryColor }}
          >
            <p className="mb-0 text-secondary">{universo.description}</p>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold mb-0" style={{ color: primaryColor }}>
            <i className="bi bi-people-fill me-2" />Personajes del universo
          </h4>
          {!loadingPersonajes && (
            <span className="badge bg-primary rounded-pill px-3 py-2">{personajes.length}</span>
          )}
        </div>

        {!loadingPersonajes && personajes.length > 0 && (
          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1">
                <i className="bi bi-sort-down me-1" />Ordenar por
              </label>
              <select 
                className="form-select form-select-sm" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Fecha de creación</option>
                <option value="updatedAt">Última actualización</option>
                <option value="views">Vistas</option>
                <option value="name">Nombre</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted mb-1">
                <i className="bi bi-arrow-down-up me-1" />Orden
              </label>
              <select 
                className="form-select form-select-sm" 
                value={order} 
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        )}

        {loadingPersonajes && (
          <div className="d-flex align-items-center gap-2 text-muted py-3">
            <div className="spinner-border spinner-border-sm" role="status" />
            Cargando personajes...
          </div>
        )}

        {!loadingPersonajes && personajes.length === 0 && (
          <Alert type="info" message="No hay personajes registrados para este universo." />
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
    </div>
  );
}
