import React from 'react';

const GameSchedule = ({ schedule }) => {
  return (
    <div>
      <h2>Game Schedule</h2>
      <p>{schedule.game.date} - {schedule.game.time}</p>
      <p>{schedule.game.teams}</p>
    </div>
  );
};

export default GameSchedule;

