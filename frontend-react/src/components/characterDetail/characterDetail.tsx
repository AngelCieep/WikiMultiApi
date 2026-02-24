import { useEffect, useState } from 'react';
import type { Character } from '../../interfaces/character.interface';
import { apiService } from '../../services/api.service';
import './characterDetail.css';

type CharacterDetailProps = {
  character: Character;
  onBack?: () => void;
};

export const CharacterDetail = ({ character: initial, onBack }: CharacterDetailProps) => {
  const [character, setCharacter] = useState<Character>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const universeId =
      typeof initial.universeId === 'string'
        ? initial.universeId
        : (initial.universeId as unknown as { _id?: string })?._id ?? String(initial.universeId);
    apiService.getCharacter(universeId, initial._id).then((data) => {
      if (data) setCharacter(data);
      setLoading(false);
    });
  }, [initial._id, initial.universeId]);

  const hasExtra =
    character.location ||
    character.affiliation ||
    (character.abilities && character.abilities.length > 0) ||
    (character.stats && Object.keys(character.stats).length > 0);

  return (
    <div className="cd-root">
      {/* ── Top bar ── */}
      <div className="cd-topbar">
        <button className="cd-back-btn" onClick={onBack}>◀ Volver</button>
        <span className="cd-views">{character.views ?? 0} visitas</span>
      </div>

      {loading ? (
        <div className="cd-loading">Cargando personaje...</div>
      ) : (
        <div className="cd-content">
          {/* ── HERO ── */}
          <div className="cd-hero">
            <div className="cd-hero-avatar">
              {character.image ? (
                <img src={character.image} alt={character.name} />
              ) : (
                <span>{character.name.slice(0, 1)}</span>
              )}
            </div>
            <div className="cd-hero-info">
              <h1 className="cd-hero-name">{character.name}</h1>
              {character.title && <p className="cd-hero-title">{character.title}</p>}
              <div className="cd-hero-badges">
                {character.type && <span className="cd-badge cd-badge--type">{character.type}</span>}
                {character.booleanField !== undefined && (
                  <span className={`cd-badge ${character.booleanField ? 'cd-badge--active' : 'cd-badge--inactive'}`}>
                    {character.booleanField ? 'Activo' : 'Inactivo'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className={`cd-body ${hasExtra ? 'cd-body--two-col' : 'cd-body--one-col'}`}>
            {/* Left: description */}
            <div className="cd-main">
              {character.description && (
                <div className="cd-panel">
                  <h3 className="cd-panel-title">Descripción</h3>
                  <p className="cd-text">{character.description}</p>
                </div>
              )}
              {character.descriptionSections && character.descriptionSections.length > 0 && (
                <div className="cd-panel">
                  {character.descriptionSections.map((sec, i) => (
                    <div key={i} className="cd-section">
                      {sec.sectionTitle && <h4 className="cd-section-heading">{sec.sectionTitle}</h4>}
                      {sec.content && <p className="cd-text">{sec.content}</p>}
                    </div>
                  ))}
                </div>
              )}
              {!character.description &&
                (!character.descriptionSections || character.descriptionSections.length === 0) && (
                  <div className="cd-panel cd-panel--empty">Sin descripción disponible.</div>
                )}
            </div>

            {/* Right: meta + abilities + stats */}
            {hasExtra && (
              <div className="cd-side">
                {(character.location || character.affiliation) && (
                  <div className="cd-panel">
                    <h3 className="cd-panel-title">Información</h3>
                    {character.location && (
                      <div className="cd-meta-row">
                        <span className="cd-meta-icon">📍</span>
                        <div>
                          <div className="cd-meta-label">Ubicación</div>
                          <div className="cd-meta-value">{character.location}</div>
                        </div>
                      </div>
                    )}
                    {character.affiliation && (
                      <div className="cd-meta-row">
                        <span className="cd-meta-icon">🏛️</span>
                        <div>
                          <div className="cd-meta-label">Afiliación</div>
                          <div className="cd-meta-value">{character.affiliation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {character.abilities && character.abilities.length > 0 && (
                  <div className="cd-panel">
                    <h3 className="cd-panel-title">Habilidades</h3>
                    <div className="cd-tags">
                      {character.abilities.map((ab, i) => (
                        <span key={i} className="cd-tag">{ab}</span>
                      ))}
                    </div>
                  </div>
                )}

                {character.stats && Object.keys(character.stats).length > 0 && (
                  <div className="cd-panel">
                    <h3 className="cd-panel-title">Stats</h3>
                    <div className="cd-stats">
                      {Object.entries(character.stats).map(([key, val]) => (
                        <div key={key} className="cd-stat">
                          <div className="cd-stat-header">
                            <span className="cd-stat-name">{key}</span>
                            <span className="cd-stat-val">{val}</span>
                          </div>
                          <div className="cd-stat-track">
                            <div
                              className="cd-stat-fill"
                              style={{ width: `${Math.min((val / 255) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
