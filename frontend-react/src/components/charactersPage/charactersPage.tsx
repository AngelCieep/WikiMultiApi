import { useEffect, useState } from 'react';
import type { Character } from '../../interfaces/character.interface';
import { apiService } from '../../services/api.service';
import './charactersPage.css';

type CharactersPageProps = {
  title: string;
  universeId: string;
  onSelectCharacter?: (character: Character) => void;
  onBack?: () => void;
};

export const CharactersPage = ({
  title,
  universeId,
  onSelectCharacter,
  onBack
}: CharactersPageProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.getCharactersByUniverse(universeId).then((data) => {
      setCharacters(data);
      setLoading(false);
    });
  }, [universeId]);

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="characters-page">
      <div className="characters-page-header">
        <div className="characters-page-header-left">
          {onBack && (
            <button className="characters-page-back" onClick={onBack}>◀ Volver</button>
          )}
          <h2 className="characters-page-title">{title}</h2>
        </div>
        <div className="characters-page-search-wrap">
          <span className="characters-page-search-icon">🔍</span>
          <input
            className="characters-page-search"
            type="text"
            placeholder="Buscar personaje..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="characters-page-search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="characters-page-empty">Cargando personajes...</div>
      ) : (
        <div className="characters-page-grid">
          {filtered.length === 0 ? (
            <div className="characters-page-empty">No se encontraron personajes.</div>
          ) : (
            filtered.map((character) => (
              <button
                key={character._id}
                className="characters-page-card"
                onClick={() => onSelectCharacter?.(character)}
              >
                <div className="characters-page-avatar">
                  {character.image ? (
                    <img src={character.image} alt={character.name} />
                  ) : (
                    <span>{character.name.slice(0, 1)}</span>
                  )}
                </div>
                <div className="characters-page-info">
                  <div className="characters-page-name">{character.name}</div>
                  {character.title && (
                    <div className="characters-page-subtitle">{character.title}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
