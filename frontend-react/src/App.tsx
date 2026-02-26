import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './componentes/HomePage';
import PersonajeDetail from './componentes/PersonajeDetail';
import UniversoDetail from './componentes/UniversoDetail';
import FetchingBase from './componentes/FetchingBase';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand fw-bold fs-4" to="/">
            <i className="bi bi-collection-fill me-2 text-warning" />
            WikiMultiApi
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-1">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 rounded ${isActive ? 'active bg-secondary' : ''}`
                  }
                  to="/"
                >
                  <i className="bi bi-house-fill me-1" />Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 rounded ${isActive ? 'active bg-secondary' : ''}`
                  }
                  to="/fetching"
                >
                  <i className="bi bi-code-slash me-1" />Fetching Base
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Rutas */}
      <main className="bg-body-tertiary min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personaje/:id" element={<PersonajeDetail />} />
          <Route path="/universo/:id" element={<UniversoDetail />} />
          <Route path="/fetching" element={<FetchingBase />} />
          <Route
            path="*"
            element={
              <div className="container mt-5 text-center">
                <i className="bi bi-emoji-dizzy display-1 text-muted" />
                <h2 className="mt-3">404 — Página no encontrada</h2>
                <NavLink className="btn btn-dark mt-3" to="/">
                  <i className="bi bi-house me-1" />Volver al inicio
                </NavLink>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-secondary text-center py-3 small">
        WikiMultiApi &copy; {new Date().getFullYear()} — Angel Mariblanca &amp; Francisco Vives
      </footer>
    </BrowserRouter>
  );
}

export default App;

