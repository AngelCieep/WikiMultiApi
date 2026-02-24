import { useState, useEffect } from 'react';
import './homeBar.css';

export const HomeBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getImagePath = (char: string): string => {
    if (char === ':') {
      return '/src/assets/background/dosPuntos.png';
    }
    return `/src/assets/background/${char}.png`;
  };

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
          <div className="wii-button">
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
                src={getImagePath(char)}
                alt={char}
                className="time-digit"
              />
            ))}
          </div>
          <div className="date-display">{formatDate()}</div>
        </div>

        <div className="home-bar-right">
          <div className="message-icon">
            <div className="envelope">✉</div>
            <div className="message-count">1</div>
          </div>
        </div>
      </div>
      <div className="home-bar-wave"></div>
    </div>
  );
};
