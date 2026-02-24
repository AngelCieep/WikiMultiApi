import { useEffect, useState } from 'react';
import { apiService } from '../../services/api.service';
import type { Universe } from '../../interfaces/universe.interface';
import type { Character } from '../../interfaces/character.interface';
import './wiiGame.css';

type UniverseWithCharacters = Universe & {
  characters: Character[];
};

export const WiiGame = () => {
  const [universes, setUniverses] = useState<UniverseWithCharacters[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseWithCharacters | null>(null);

  useEffect(() => {
    loadUniverses();
  }, []);

  const loadUniverses = async () => {
    setLoading(true);
    const data = await apiService.getUniverses();
    const universesWithCharacters = await Promise.all(
      data.map(async (universe) => {
        const characters = await apiService.getCharactersByUniverse(universe._id);
        return {
          ...universe,
          characters
        };
      })
    );
    setUniverses(universesWithCharacters);
    setLoading(false);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.wii-channels-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const getChannelColor = (index: number): string => {
    const colors = [
      '#0094FF', // Azul Forecast
      '#00A651', // Verde News
      '#FF6B00', // Naranja Photo
      '#00D4FF', // Cyan
      '#FF1744', // Rojo
      '#9C27B0', // Púrpura
      '#FFB300', // Amarillo
      '#795548', // Marrón
      '#4CAF50', // Verde claro
      '#FF9800', // Naranja oscuro
      '#E91E63', // Rosa
      '#3F51B5', // Índigo
    ];
    return colors[index % colors.length];
  };

  // Crear un array de 12 espacios para los canales (3 filas x 4 columnas)
  const channelSlots = Array.from({ length: 12 }, (_, index) => {
    // La primera casilla siempre es el disco de la Wii
    if (index === 0) {
      return { type: 'disc' as const, index };
    }
    // Los universos empiezan desde la segunda casilla
    if (index - 1 < universes.length) {
      return { type: 'universe' as const, data: universes[index - 1], index };
    }
    return { type: 'empty' as const, index };
  });

  if (loading) {
    return (
      <div className="wii-game-container">
        <div className="wii-loading">Loading Channels...</div>
      </div>
    );
  }

  const closeDetails = () => {
    setSelectedUniverse(null);
  };

  return (
    <div className="wii-game-container">
      <button 
        className="wii-nav-button wii-nav-left" 
        onClick={() => handleScroll('left')}
      >
        ◀
      </button>
      
      <div className="wii-channels-wrapper">
        <div className="wii-channels-container">
          {channelSlots.map((slot) => (
            <div 
              key={slot.type === 'universe' ? slot.data._id : `${slot.type}-${slot.index}`}
              className={`wii-channel ${slot.type === 'empty' ? 'wii-channel-empty' : ''} ${slot.type === 'disc' ? 'wii-channel-disc' : ''}`}
              style={slot.type === 'universe' ? {
                backgroundImage: slot.data.backgroundImage ? `url(${slot.data.backgroundImage})` : undefined,
                backgroundColor: slot.data.backgroundImage
                  ? undefined
                  : slot.data.primaryColor || getChannelColor(slot.index),
              } : undefined}
              onClick={slot.type === 'universe' ? () => setSelectedUniverse(slot.data) : undefined}
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
      >
        ▶
      </button>

      {selectedUniverse && (
        <div className="wii-modal-overlay" onClick={closeDetails}>
          <div className="wii-modal" onClick={(event) => event.stopPropagation()}>
            <div className="wii-modal-header">
              <div className="wii-modal-title">{selectedUniverse.name}</div>
              <button className="wii-modal-close" onClick={closeDetails}>✕</button>
            </div>
            <div className="wii-modal-body">
              {(selectedUniverse.imagenBoton || selectedUniverse.logo) && (
                <div className="wii-modal-logo">
                  <img
                    src={selectedUniverse.imagenBoton || selectedUniverse.logo}
                    alt={selectedUniverse.name}
                  />
                </div>
              )}
              <div className="wii-modal-characters">
                {selectedUniverse.characters.length === 0 ? (
                  <div className="wii-modal-empty">No hay personajes para este universo.</div>
                ) : (
                  selectedUniverse.characters.map((character) => (
                    <div key={character._id} className="wii-modal-character">
                      <div className="wii-modal-avatar">
                        {character.image ? (
                          <img src={character.image} alt={character.name} />
                        ) : (
                          <span>{character.name.slice(0, 1)}</span>
                        )}
                      </div>
                      <div className="wii-modal-name">{character.name}</div>
                      {character.title && (
                        <div className="wii-modal-title-small">{character.title}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
