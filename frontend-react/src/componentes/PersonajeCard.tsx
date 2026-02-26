import { useNavigate } from 'react-router-dom';
import type { PersonajeCard as IPersonajeCard } from '../types';

interface Props {
  personaje: IPersonajeCard;
}

export default function PersonajeCard({ personaje }: Props) {
  const navigate = useNavigate();
  const placeholder = 'https://placehold.co/300x200?text=Sin+imagen';

  return (
    <div
      className="card h-100 border-0 shadow rounded-3 overflow-hidden"
      role="button"
      onClick={() => navigate(`/personaje/${personaje._id}`)}
    >
      <div className="ratio ratio-4x3">
        <img
          src={personaje.image || placeholder}
          className="object-fit-cover w-100 h-100"
          alt={personaje.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder;
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-1">{personaje.name}</h6>
        {personaje.title && (
          <p className="card-text text-muted small mb-2 lh-sm">{personaje.title}</p>
        )}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className={`badge rounded-pill ${personaje.booleanField ? 'bg-success' : 'bg-secondary'}`}>
            {personaje.booleanField ? 'Activo' : 'Inactivo'}
          </span>
          {personaje.views !== undefined && (
            <small className="text-muted">
              <i className="bi bi-eye me-1" />{personaje.views}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
