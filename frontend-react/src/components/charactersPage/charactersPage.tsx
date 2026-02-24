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

  useEffect(() => {
    setLoading(true);
    apiService.getCharactersByUniverse(universeId).then((data) => {
      setCharacters(data);
      setLoading(false);
    });
  }, [universeId]);

  return (
    <div className="characters-page">
      <div className="characters-page-header">
        <h2 className="characters-page-title">{title}</h2>
        {onBack && (
          <button className="characters-page-back" onClick={onBack}>◀ Back</button>
        )}
      </div>
      {loading ? (
        <div className="characters-page-empty">Loading characters...</div>
      ) : (
        <div className="characters-page-grid">
          {characters.length === 0 ? (
            <div className="characters-page-empty">No characters yet.</div>
          ) : (
            characters.map((character) => (
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
