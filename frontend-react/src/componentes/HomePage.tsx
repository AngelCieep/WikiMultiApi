import { useEffect, useState } from 'react';
import type { UniversoCard as IUniversoCard } from '../types';
import UniversoCardComponent from './UniversoCard';

export default function HomePage() {
  const [universos, setUniversos] = useState<IUniversoCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const ITEMS_POR_PAGINA = 24;

  useEffect(() => {
    fetch('https://backend-wikiapi.vercel.app/api/v1/universes')
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data.status) ? data.status : Array.isArray(data) ? data : [];
        setUniversos(list);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const universosFiltrados = universos.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculos de paginación
  const totalPaginas = Math.ceil(universosFiltrados.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
  const universosPaginados = universosFiltrados.slice(indiceInicio, indiceFin);

  // Resetear página al buscar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const apiOk = !error;


  return (
    <>
      <div className="bg-dark text-white py-5 mb-0 container-fluid">
        <div className="container text-center py-3">
          <i className="bi bi-collection-fill display-3 text-warning mb-3 d-block" />
          <h1 className="display-4 fw-bold mb-2">WikiMultiApi</h1>
          <p className="lead text-secondary mb-4">
            Explora universos de tus series, películas y videojuegos favoritos
          </p>
          <span className={`badge rounded-pill fs-6 px-3 py-2 ${apiOk ? 'bg-success' : 'bg-danger'}`}>
            <i className={`bi ${apiOk ? 'bi-wifi' : 'bi-wifi-off'} me-2`} />
            API {apiOk ? 'conectada' : 'sin conexión'}
          </span>
          {!loading && apiOk && (
            <div className="row justify-content-center mt-4">
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
                placeholder="Buscar universo..."
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

        {loading && (
          <div className="d-flex flex-column align-items-center py-5 gap-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando universos...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5" />
            <div>
              <strong>Error de conexión:</strong> {error}
              <br />
              <small>Comprueba que la API esté activa en <code>https://backend-wikiapi.vercel.app/api/v1</code></small>
            </div>
          </div>
        )}

        {!loading && !error && universosFiltrados.length === 0 && (
          <div className="alert alert-info d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill fs-5" />
            No se encontraron universos{busqueda ? ` para "${busqueda}"` : ''}.
          </div>
        )}

        {!loading && !error && universosFiltrados.length > 0 && (
          <>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3 mb-4">
              {universosPaginados.map((u) => (
                <div className="col" key={u._id}>
                  <UniversoCardComponent universo={u} />
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <nav aria-label="Navegación de páginas">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual - 1)}
                      disabled={paginaActual === 1}
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                    <li key={pagina} className={`page-item ${pagina === paginaActual ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPaginaActual(pagina)}
                      >
                        {pagina}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
