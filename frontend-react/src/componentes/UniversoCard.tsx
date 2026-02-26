import { useNavigate } from 'react-router-dom';
import type { UniversoCard as IUniversoCard } from '../types';

interface Props {
  universo: IUniversoCard;
}

export default function UniversoCard({ universo }: Props) {
  const navigate = useNavigate();
  const placeholder = 'https://placehold.co/300x180?text=Universo';

  return (
    <div
      className="card h-100 border-0 shadow rounded-3 overflow-hidden"
      role="button"
      onClick={() => navigate(`/universo/${universo._id}`)}
    >
      <div className="ratio ratio-16x9">
        <img
          src={universo.imagenBoton || universo.logo || placeholder}
          className="object-fit-cover w-100 h-100"
          alt={universo.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder;
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-1">{universo.name}</h6>
        {universo.description && (
          <p className="card-text text-muted small mb-2 lh-sm">
            {universo.description.length > 80
              ? universo.description.slice(0, 80) + '…'
              : universo.description}
          </p>
        )}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className={`badge rounded-pill ${universo.isActive ? 'bg-success' : 'bg-secondary'}`}>
            {universo.isActive ? 'Activo' : 'Inactivo'}
          </span>
          <small className="text-muted">
            <i className="bi bi-star-fill text-warning me-1" />{universo.popularityScore}
          </small>
        </div>
      </div>
    </div>
  );
}
