import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
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
  );
}
