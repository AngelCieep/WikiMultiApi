import { useState, useEffect } from 'react';
import './homeBar.css';

import digit0 from '../../assets/background/0.png';
import digit1 from '../../assets/background/1.png';
import digit2 from '../../assets/background/2.png';
import digit3 from '../../assets/background/3.png';
import digit4 from '../../assets/background/4.png';
import digit5 from '../../assets/background/5.png';
import digit6 from '../../assets/background/6.png';
import digit7 from '../../assets/background/7.png';
import digit8 from '../../assets/background/8.png';
import digit9 from '../../assets/background/9.png';
import digitColon from '../../assets/background/dosPuntos.png';

const DIGIT_MAP: Record<string, string> = {
  '0': digit0, '1': digit1, '2': digit2, '3': digit3, '4': digit4,
  '5': digit5, '6': digit6, '7': digit7, '8': digit8, '9': digit9,
  ':': digitColon,
};

export const HomeBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [letterOpen, setLetterOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    hours = hours % 24;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
  };

  const formatDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    
    const dayName = days[currentTime.getDay()];
    const month = months[currentTime.getMonth()];
    const day = currentTime.getDate();
    
    return `${dayName} ${month}/${day}`;
  };

  const timeString = formatTime();

  return (
    <div className="home-bar">
      <div className="home-bar-content">
        <div className="home-bar-left">
          <div className="wii-button" onClick={() => setHomeMenuOpen(true)}>
            <div className="wii-button-text">Wii</div>
          </div>
          <div className="disc-icon">
            <div className="disc-slot"></div>
          </div>
        </div>

        <div className="home-bar-center">
          <div className="time-display">
            {timeString.split('').map((char, index) => (
              <img
                key={index}
                src={DIGIT_MAP[char]}
                alt={char}
                className="time-digit"
              />
            ))}
          </div>
          <div className="date-display">{formatDate()}</div>
        </div>

        <div className="home-bar-right">
          <div className="message-icon" onClick={() => setLetterOpen(true)}>
            <div className="envelope">✉</div>
            <div className="message-count">1</div>
          </div>
        </div>
      </div>
      <div className="home-bar-wave"></div>

      {homeMenuOpen && (
        <div className="hm-overlay">
          {/* Top bar */}
          <div className="hm-topbar">
            <span className="hm-title">HOME Menu</span>
            <button className="hm-close-btn" onClick={() => setHomeMenuOpen(false)}>
              <span className="hm-close-icon">&#x2302;</span>
              <span className="hm-close-label">Close</span>
            </button>
          </div>

          {/* Center content */}
          <div className="hm-body">
            <button className="hm-wii-menu-btn" onClick={() => setHomeMenuOpen(false)}>
              Wii Menu
            </button>
          </div>

          {/* Bottom bar */}
          <div className="hm-bottombar">
            <div className="hm-remote-img">
              <div className="hm-remote-shape">
                <div className="hm-remote-dpad">✜</div>
                <div className="hm-remote-btns">
                  <span>A</span><span>B</span>
                </div>
              </div>
            </div>
            <div className="hm-players">
              {['P1', 'P2', 'P3', 'P4'].map((p, i) => (
                <div key={p} className={`hm-player ${i === 0 ? 'hm-player--active' : ''}`}>
                  <span className="hm-player-label">{p}</span>
                  <div className="hm-battery">
                    {[0,1,2,3].map(b => (
                      <div key={b} className={`hm-battery-bar ${i === 0 && b < 4 ? 'hm-battery-bar--full' : ''}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="hm-remote-settings">Wii Remote Settings</div>
          </div>
        </div>
      )}

      {letterOpen && (
        <div className="letter-overlay" onClick={() => setLetterOpen(false)}>
          <div className="letter-card" onClick={(e) => e.stopPropagation()}>
            <div className="letter-header">
              <span className="letter-icon">✉</span>
              <span className="letter-from">Mensaje recibido</span>
            </div>
            <div className="letter-body">
              <p className="letter-greeting">¡Hola!</p>
              <p className="letter-text">
                Gracias por usar <strong>WikiMultiApi</strong>.
              </p>
              <p className="letter-signature">by Angel Mariblanca &amp; Francisco Vives</p>
            </div>
            <button className="letter-close" onClick={() => setLetterOpen(false)}>Cerrar ✕</button>
          </div>
        </div>
      )}
    </div>
  );
};
