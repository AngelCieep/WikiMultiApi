interface AlertProps {
  type: 'danger' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  icon?: string;
  children?: React.ReactNode;
}

export default function Alert({ type, title, message, icon, children }: AlertProps) {
  const iconMap = {
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-question-circle-fill',
    info: 'bi-info-circle-fill',
    success: 'bi-check-circle-fill'
  };

  const defaultIcon = icon || iconMap[type];

  return (
    <div className={`alert alert-${type} d-flex align-items-center gap-2`}>
      <i className={`bi ${defaultIcon} fs-5`} />
      <div className="flex-grow-1">
        {title && <strong>{title}</strong>}
        {title && ' '}
        {message}
        {children}
      </div>
    </div>
  );
}
