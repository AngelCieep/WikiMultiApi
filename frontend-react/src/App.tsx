import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import Footer from './componentes/Footer';
import HomePage from './componentes/HomePage';
import PersonajeDetail from './componentes/PersonajeDetail';
import UniversoDetail from './componentes/UniversoDetail';
import FetchingBase from './componentes/FetchingBase';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="bg-body-tertiary min-vh-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="universo/:universeId/personaje/:id" element={<PersonajeDetail />} />
          <Route path="universo/:id" element={<UniversoDetail />} />
          <Route path="fetching" element={<FetchingBase />} />
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;

