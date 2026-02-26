export default function PersonajeCard({ personaje }: {
  personaje: {
    _id: string;
    name: string;
    title?: string;
    image?: string;
    booleanField: boolean;
    universeId?: string;
    views?: number;
  }
}) {
  const placeholder = 'https://placehold.co/300x200?text=Sin+imagen';

  return (
    <a
      href={`/universo/${personaje.universeId}/personaje/${personaje._id}`}
      className="card h-100 border-0 shadow rounded-3 overflow-hidden text-decoration-none"
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
    </a>
  );
}
