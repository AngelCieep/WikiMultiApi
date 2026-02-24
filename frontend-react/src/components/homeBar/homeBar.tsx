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

  const formatTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const formatDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    
    const dayName = days[currentTime.getDay()];
    const month = months[currentTime.getMonth()];
    const day = currentTime.getDate();
    
    return `${dayName} ${month}/${day}`;
  };

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
          <div className="time-display">{formatTime()}</div>
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
