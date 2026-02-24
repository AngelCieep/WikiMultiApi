import { useEffect, useState } from 'react';
import { apiService } from '../../services/api.service';
import type { Universe } from '../../interfaces/universe.interface';
import type { Character } from '../../interfaces/character.interface';
import { StartPage } from '../startPage/startPage';
import { CharactersPage } from '../charactersPage/charactersPage';
import { CharacterDetail } from '../characterDetail/characterDetail';
import './wiiGame.css';

type UniverseWithCharacters = Universe & {
  characters: Character[];
};

export const WiiGame = () => {
  const [universes, setUniverses] = useState<UniverseWithCharacters[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseWithCharacters | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalStep, setModalStep] = useState<'universe' | 'characters' | 'character'>('universe');

  useEffect(() => {
    loadUniverses();
  }, []);

  const loadUniverses = async () => {
    setLoading(true);
    const data = await apiService.getUniverses();
    const universesWithCharacters = await Promise.all(
      data.map(async (universe) => {
        const [characters, styleData] = await Promise.all([
          apiService.getCharactersByUniverse(universe._id),
          apiService.getUniverseStyle(universe.slug)
        ]);
        return {
          ...universe,
          ...styleData,
          characters
        };
      })
    );
    setUniverses(universesWithCharacters);
    setLoading(false);
  };

  const SLOTS_PER_PAGE = 12;

  // Build all slots: disc first, then universes
  const allSlots: ({ type: 'disc'; index: number } | { type: 'universe'; data: UniverseWithCharacters; index: number } | { type: 'empty'; index: number })[] = [
    { type: 'disc', index: 0 },
    ...universes.map((u, i) => ({ type: 'universe' as const, data: u, index: i + 1 })),
  ];
  // Pad to at least 2 full pages so arrows always have content to navigate
  const minSlots = SLOTS_PER_PAGE * 2;
  while (allSlots.length < minSlots || allSlots.length % SLOTS_PER_PAGE !== 0) {
    allSlots.push({ type: 'empty' as const, index: allSlots.length });
  }
  const totalPages = allSlots.length / SLOTS_PER_PAGE;
  const safePage = Math.min(currentPage, totalPages - 1);
  const channelSlots = allSlots.slice(safePage * SLOTS_PER_PAGE, (safePage + 1) * SLOTS_PER_PAGE);

  const handleScroll = (direction: 'left' | 'right') => {
    setSlideDir(direction);
    setCurrentPage(prev =>
      direction === 'left' ? Math.max(0, prev - 1) : Math.min(totalPages - 1, prev + 1)
    );
    setTimeout(() => setSlideDir(null), 350);
  };

  if (loading) {
    return (
      <div className="wii-game-container">
        <div className="wii-loading">Loading Channels...</div>
      </div>
    );
  }

  const openUniverse = (universe: UniverseWithCharacters) => {
    setSelectedUniverse(universe);
    setSelectedCharacter(null);
    setModalStep('universe');
  };

  const openCharacters = () => {
    setModalStep('characters');
  };

  const openCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setModalStep('character');
  };

  const goBack = () => {
    if (modalStep === 'character') {
      setModalStep('characters');
      setSelectedCharacter(null);
      return;
    }
    if (modalStep === 'characters') {
      setModalStep('universe');
    }
  };

  const closeDetails = () => {
    setSelectedUniverse(null);
    setSelectedCharacter(null);
    setModalStep('universe');
  };

  return (
    <div className="wii-game-container">
      <button 
        className="wii-nav-button wii-nav-left" 
        onClick={() => handleScroll('left')}
        disabled={safePage === 0}
      >
        ◀
      </button>
      
      <div className="wii-channels-wrapper">
        <div
            className={`wii-channels-container${slideDir === 'left' ? ' wii-slide-left' : slideDir === 'right' ? ' wii-slide-right' : ''}`}
            key={safePage}
          >
          {channelSlots.map((slot) => (
            <div 
              key={slot.type === 'universe' ? slot.data._id : `${slot.type}-${slot.index}`}
              className={`wii-channel ${slot.type === 'empty' ? 'wii-channel-empty' : ''} ${slot.type === 'disc' ? 'wii-channel-disc' : ''}`}
              style={slot.type === 'universe' ? {
                backgroundColor: slot.data.primaryColor,
                backgroundImage: slot.data.backgroundImage ? `url(${slot.data.backgroundImage})` : undefined,
              } : undefined}
              onClick={slot.type === 'universe' ? () => openUniverse(slot.data) : undefined}
            >
              {slot.type === 'disc' ? (
                <div className="wii-channel-disc-content">
                  <img 
                    src="https://i.pinimg.com/originals/d8/75/8f/d8758ff658f0a8b717f91ff89c2e530a.gif" 
                    alt="Wii Disc Channel"
                    className="wii-disc-gif"
                  />
                </div>
              ) : slot.type === 'universe' ? (
                <div className="wii-channel-content">
                  {slot.data.logo && (
                    <div className="wii-channel-logo">
                      <img src={slot.data.logo} alt={slot.data.name} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="wii-channel-empty-content">
                  <div className="wii-channel-empty-icon">+</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button 
        className="wii-nav-button wii-nav-right" 
        onClick={() => handleScroll('right')}
        disabled={safePage === totalPages - 1}
      >
        ▶
      </button>

      {totalPages > 1 && (
        <div className="wii-page-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`wii-page-dot ${i === safePage ? 'wii-page-dot--active' : ''}`}
              onClick={() => setCurrentPage(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}

      {selectedUniverse && (
        <div className="wii-modal-overlay" onClick={closeDetails}>
          <div className="wii-modal" onClick={(event) => event.stopPropagation()}>
            <div className="wii-modal-body">
              {modalStep === 'universe' && (
                <StartPage
                  title={selectedUniverse.name}
                  backgroundImage={selectedUniverse.backgroundImage}
                  logo={selectedUniverse.logo}
                  onStart={openCharacters}
                  onClose={closeDetails}
                />
              )}
              {modalStep === 'characters' && (
                <CharactersPage
                  title={selectedUniverse.name}
                  universeId={selectedUniverse._id}
                  onSelectCharacter={openCharacter}
                  onBack={goBack}
                />
              )}
              {modalStep === 'character' && selectedCharacter && (
                <CharacterDetail
                  character={selectedCharacter}
                  onBack={goBack}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
