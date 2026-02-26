import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PersonajeDetail as IPersonajeDetail } from '../types';
import { API_BASE } from '../constants';

export default function PersonajeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [personaje, setPersonaje] = useState<IPersonajeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/characters/character/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setPersonaje(null);
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data) setPersonaje(data.status);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando personaje...</p>
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

  if (notFound)
    return (
      <div className="container my-5">
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <i className="bi bi-question-circle-fill fs-4" />
          Personaje no encontrado.
        </div>
        <button className="btn btn-outline-dark" onClick={() => navigate('/')}> 
          <i className="bi bi-house me-2" />Inicio
        </button>
      </div>
    );
  if (!personaje) return null;

  const placeholder = 'https://placehold.co/400x500?text=Sin+imagen';

  return (
    <div className="container my-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0 text-decoration-none" onClick={() => navigate('/')}>
              <i className="bi bi-house me-1" />Inicio
            </button>
          </li>
          <li className="breadcrumb-item active">{personaje.name}</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4 bg-dark">
            <img
              src={personaje.image || placeholder}
              className="img-fluid w-100 object-fit-cover"
              alt={personaje.name}
              style={{ minHeight: '320px', maxHeight: '480px' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = placeholder;
              }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="fw-bold mb-1">{personaje.name}</h2>
                  {personaje.title && (
                    <p className="text-muted fs-6 mb-0">{personaje.title}</p>
                  )}
                </div>
                <div className="text-end">
                  <span className={`badge rounded-pill fs-6 px-3 ${personaje.booleanField ? 'bg-success' : 'bg-secondary'}`}>
                    {personaje.booleanField ? 'Activo' : 'Inactivo'}
                  </span>
                  {personaje.views !== undefined && (
                    <div className="text-muted small mt-1">
                      <i className="bi bi-eye me-1" />{personaje.views} visitas
                    </div>
                  )}
                </div>
              </div>

              {personaje.description && (
                <p className="text-secondary mb-3">{personaje.description}</p>
              )}

              <ul className="list-group list-group-flush mb-3">
                {personaje.location && (
                  <li className="list-group-item px-0">
                    <i className="bi bi-geo-alt-fill text-danger me-2" />
                    <strong>Ubicacion:</strong> {personaje.location}
                  </li>
                )}
                {personaje.affiliation && (
                  <li className="list-group-item px-0">
                    <i className="bi bi-flag-fill text-primary me-2" />
                    <strong>Afiliacion:</strong> {personaje.affiliation}
                  </li>
                )}
                {personaje.type && (
                  <li className="list-group-item px-0">
                    <i className="bi bi-tag-fill text-info me-2" />
                    <strong>Tipo:</strong> {personaje.type}
                  </li>
                )}
                <li className="list-group-item px-0">
                  <i className="bi bi-hash text-warning me-2" />
                  <strong>Valor numerico:</strong> {personaje.numericField}
                </li>
                <li className="list-group-item px-0">
                  <i className="bi bi-calendar-event me-2" />
                  <strong>Fecha:</strong>{' '}
                  {new Date(personaje.dateField).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </li>
              </ul>

              {personaje.abilities && personaje.abilities.length > 0 && (
                <div className="mb-3">
                  <p className="fw-semibold mb-2">
                    <i className="bi bi-lightning-charge-fill text-warning me-2" />Habilidades
                  </p>
                  <div className="d-flex flex-wrap gap-1">
                    {personaje.abilities.map((ab, i) => (
                      <span key={i} className="badge bg-primary rounded-pill px-3">
                        {ab}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {personaje.stats && Object.keys(personaje.stats).length > 0 && (
                <div>
                  <p className="fw-semibold mb-2">
                    <i className="bi bi-bar-chart-fill text-success me-2" />Estadisticas
                  </p>
                  {Object.entries(personaje.stats).map(([key, val]) => (
                    <div key={key} className="mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-capitalize fw-medium">{key}</small>
                        <small className="fw-bold">{val}</small>
                      </div>
                      <div className="progress rounded-pill" style={{ height: '8px' }}>
                        <div className="progress-bar bg-gradient" style={{ width: `${Math.min(val, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {personaje.descriptionSections && personaje.descriptionSections.length > 0 && (
          <div className="card-footer border-top p-4 bg-light">
            <h5 className="mb-3"><i className="bi bi-journal-text me-2" />Mas informacion</h5>
            <div className="row g-3">
              {personaje.descriptionSections.map((sec, i) => (
                <div className="col-md-6" key={i}>
                  <div className="card border-0 bg-white shadow-sm h-100 p-3">
                    {sec.sectionTitle && (
                      <h6 className="fw-bold text-primary mb-2">{sec.sectionTitle}</h6>
                    )}
                    {sec.content && <p className="mb-0 small">{sec.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
