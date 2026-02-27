import type { UniversoCard } from '../types';

type UniversoCardProps = {
  universo: UniversoCard;
}

export default function UniversoCard({ universo }: UniversoCardProps) {
  const placeholder = 'https://placehold.co/300x180?text=Universo';

  return (
    <a
      href={`/universo/${universo._id}`}
      className="card border-0 shadow rounded-3 overflow-hidden position-relative text-decoration-none"
      style={{ aspectRatio: '1/1' }}
    >
      <img
        src={universo.imagenBoton || universo.logo || placeholder}
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        alt={universo.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = placeholder;
        }}
      />
    </a>
  );
}
