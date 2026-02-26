interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ message = 'Cargando...', size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerStyle = size === 'lg' ? sizeClasses.lg : undefined;
  const spinnerClass = size === 'sm' ? sizeClasses.sm : '';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div 
        className={`spinner-border text-primary ${spinnerClass}`}
        style={spinnerStyle}
        role="status"
      >
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
}
