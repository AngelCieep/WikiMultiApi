import './startPage.css';

type StartPageProps = {
  title: string;
  backgroundImage?: string;
  logo?: string;
  onStart?: () => void;
  onClose?: () => void;
};

export const StartPage = ({
  title,
  backgroundImage,
  logo,
  onStart,
  onClose
}: StartPageProps) => {
  return (
    <div className="start-page">
      <div
        className="start-page-background"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
      />
      <div className="start-page-content">
        <div className="start-page-logo-area">
          {logo ? (
            <img src={logo} alt={title} className="start-page-logo-img" />
          ) : (
            <h2 className="start-page-title">{title}</h2>
          )}
        </div>
        <div className="start-page-actions">
          {onClose && (
            <button className="start-page-btn start-page-btn--menu" onClick={onClose}>
              <span className="start-page-btn-shine" />
              Menú de Wii
            </button>
          )}
          {onStart && (
            <button className="start-page-btn start-page-btn--start" onClick={onStart}>
              <span className="start-page-btn-shine" />
              Comenzar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
