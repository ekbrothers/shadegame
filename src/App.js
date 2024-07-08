
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameSchedule from './components/GameSchedule';
import StadiumMap from './components/StadiumMap';

const App = () => {
  const [schedule, setSchedule] = useState(null);
  const [stadium, setStadium] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/schedule')
      .then(response => setSchedule(response.data))
      .catch(error => console.error('Error fetching schedule:', error));

    axios.get('http://localhost:5000/api/stadium')
      .then(response => setStadium(response.data))
      .catch(error => console.error('Error fetching stadium:', error));
  }, []);

  return (
    <div>
      {schedule && <GameSchedule schedule={schedule} />}
      {stadium && <StadiumMap stadium={stadium} />}
    </div>
  );
};

export default App;
