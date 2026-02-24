import { useEffect, useState } from 'react';
import { apiService } from '../../services/api.service';
import type { Universe } from '../../interfaces/universe.interface';
import './wiiGame.css';

export const WiiGame = () => {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUniverses();
  }, []);

  const loadUniverses = async () => {
    setLoading(true);
    const data = await apiService.getUniverses();
    setUniverses(data);
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
                backgroundColor: slot.data.color || getChannelColor(slot.index),
              } : undefined}
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
                  <div className="wii-channel-title">{slot.data.name}</div>
                  {slot.data.image && (
                    <div className="wii-channel-image">
                      <img src={slot.data.image} alt={slot.data.name} />
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
    </div>
  );
};
