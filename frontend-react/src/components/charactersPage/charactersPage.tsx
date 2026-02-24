import { useEffect, useState } from 'react';
import type { Character } from '../../interfaces/character.interface';
import { apiService } from '../../services/api.service';
import './charactersPage.css';

const PAGE_SIZE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Build page number list: always show first, last, current ±2, and ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    const around = new Set([1, totalPages, safePage - 1, safePage, safePage + 1].filter(p => p >= 1 && p <= totalPages));
    let prev = 0;
    for (const p of [...around].sort((a, b) => a - b)) {
      if (p - prev > 1) pages.push('...');
      pages.push(p);
      prev = p;
    }
    return pages;
  };

  return (
    <div className="characters-page">
      {/* Header */}
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
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button className="characters-page-search-clear" onClick={() => handleSearch('')}>×</button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="characters-page-empty">Cargando personajes...</div>
      ) : (
        <>
          <div className="characters-page-grid">
            {paginated.length === 0 ? (
              <div className="characters-page-empty">No se encontraron personajes.</div>
            ) : (
              paginated.map((character) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="characters-page-pagination">
              <button
                className="cp-page-btn cp-page-btn--nav"
                onClick={() => setCurrentPage(1)}
                disabled={safePage === 1}
              >«</button>
              <button
                className="cp-page-btn cp-page-btn--nav"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >‹</button>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="cp-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`cp-page-btn ${p === safePage ? 'cp-page-btn--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >{p}</button>
                )
              )}

              <button
                className="cp-page-btn cp-page-btn--nav"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >›</button>
              <button
                className="cp-page-btn cp-page-btn--nav"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage === totalPages}
              >»</button>

              <span className="cp-page-info">{filtered.length} personajes · pág. {safePage}/{totalPages}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
