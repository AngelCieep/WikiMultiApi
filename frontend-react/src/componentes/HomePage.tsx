import { useEffect, useState } from 'react';
import type { PersonajeCard as IPersonajeCard, UniversoCard as IUniversoCard } from '../types';
import PersonajeCardComponent from './PersonajeCard';
import UniversoCardComponent from './UniversoCard';
import { API_BASE } from '../constants';

export default function HomePage() {
  const [personajes, setPersonajes] = useState<IPersonajeCard[]>([]);
  const [universos, setUniversos] = useState<IUniversoCard[]>([]);
  const [loadingP, setLoadingP] = useState<boolean>(true);
  const [loadingU, setLoadingU] = useState<boolean>(true);
  const [errorP, setErrorP] = useState<string | null>(null);
  const [errorU, setErrorU] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [tab, setTab] = useState<'personajes' | 'universos'>('personajes');

  useEffect(() => {
    fetch(`${API_BASE}/characters/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data.status)) throw new Error('Respuesta inesperada de la API');
        setPersonajes(data.status);
        setLoadingP(false);
      })
      .catch((err: Error) => {
        setErrorP(err.message);
        setLoadingP(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/universes`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data.status) ? data.status : Array.isArray(data) ? data : [];
        setUniversos(list);
        setLoadingU(false);
      })
      .catch((err: Error) => {
        setErrorU(err.message);
        setLoadingU(false);
      });
  }, []);

  const personajesFiltrados = personajes.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );
  const universosFiltrados = universos.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const apiOk = !errorP && !errorU;


  return (
    <>
      <div className="bg-dark text-white py-5 mb-0 container-fluid">
        <div className="container text-center py-3">
          <i className="bi bi-collection-fill display-3 text-warning mb-3 d-block" />
          <h1 className="display-4 fw-bold mb-2">WikiMultiApi</h1>
          <p className="lead text-secondary mb-4">
            Explora universos y personajes de tus series, películas y videojuegos favoritos
          </p>
          <span className={`badge rounded-pill fs-6 px-3 py-2 ${apiOk ? 'bg-success' : 'bg-danger'}`}>
            <i className={`bi ${apiOk ? 'bi-wifi' : 'bi-wifi-off'} me-2`} />
            API {apiOk ? 'conectada' : 'sin conexión'}
          </span>
          {!loadingP && !loadingU && apiOk && (
            <div className="row justify-content-center mt-4 g-3">
              <div className="col-auto">
                <div className="badge bg-secondary fs-6 px-4 py-2 rounded-3">
                  <i className="bi bi-people-fill me-2" />
                  {personajes.length} personajes
                </div>
              </div>
              <div className="col-auto">
                <div className="badge bg-secondary fs-6 px-4 py-2 rounded-3">
                  <i className="bi bi-globe2 me-2" />
                  {universos.length} universos
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container py-4">
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="search"
                className="form-control border-start-0"
                placeholder={tab === 'personajes' ? 'Buscar personaje...' : 'Buscar universo...'}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className="btn btn-outline-secondary" onClick={() => setBusqueda('')}>
                  <i className="bi bi-x-lg" />
                </button>
              )}
            </div>
          </div>
        </div>

        <ul className="nav nav-pills mb-4 justify-content-center gap-2">
          <li className="nav-item">
            <button
              className={`nav-link px-4 ${tab === 'personajes' ? 'active' : 'text-dark border'}`}
              onClick={() => { setTab('personajes'); setBusqueda(''); }}
            >
              <i className="bi bi-people me-2" />
              Personajes
              {!loadingP && (
                <span className={`badge ms-2 ${tab === 'personajes' ? 'bg-light text-dark' : 'bg-dark'}`}>
                  {personajesFiltrados.length}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link px-4 ${tab === 'universos' ? 'active' : 'text-dark border'}`}
              onClick={() => { setTab('universos'); setBusqueda(''); }}
            >
              <i className="bi bi-globe2 me-2" />
              Universos
              {!loadingU && (
                <span className={`badge ms-2 ${tab === 'universos' ? 'bg-light text-dark' : 'bg-dark'}`}>
                  {universosFiltrados.length}
                </span>
              )}
            </button>
          </li>
        </ul>

        {tab === 'personajes' && (
          <>
            {loadingP && (
              <div className="d-flex flex-column align-items-center py-5 gap-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando personajes...</p>
              </div>
            )}
            {errorP && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill fs-5" />
                <div>
                  <strong>Error de conexion:</strong> {errorP}
                  <br />
                  <small>Comprueba que la API este activa en <code>{API_BASE}</code></small>
                </div>
              </div>
            )}
            {!loadingP && !errorP && personajesFiltrados.length === 0 && (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill fs-5" />
                No se encontraron personajes{busqueda ? ` para "${busqueda}"` : ''}.
              </div>
            )}
            {!loadingP && !errorP && personajesFiltrados.length > 0 && (
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3">
                {personajesFiltrados.map((p) => (
                  <div className="col" key={p._id}>
                    <PersonajeCardComponent personaje={p} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'universos' && (
          <>
            {loadingU && (
              <div className="d-flex flex-column align-items-center py-5 gap-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando universos...</p>
              </div>
            )}
            {errorU && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill fs-5" />
                <div><strong>Error de conexion:</strong> {errorU}</div>
              </div>
            )}
            {!loadingU && !errorU && universosFiltrados.length === 0 && (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill fs-5" />
                No se encontraron universos{busqueda ? ` para "${busqueda}"` : ''}.
              </div>
            )}
            {!loadingU && !errorU && universosFiltrados.length > 0 && (
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
                {universosFiltrados.map((u) => (
                  <div className="col" key={u._id}>
                    <UniversoCardComponent universo={u} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
