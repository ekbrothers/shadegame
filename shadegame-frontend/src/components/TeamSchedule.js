import React, { useState, useEffect } from "react";
import axios from "axios";

const TeamSchedule = ({ team, onSelectGame }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (team) {
      axios
        .get(`http://localhost:5000/api/games`)
        .then((response) => {
          const teamSchedule = response.data.filter(
            (game) => game.HomeTeam === team || game.AwayTeam === team
          );
          setSchedule(teamSchedule);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    }
  }, [team]);

  return (
    <div>
      {team && <h3>Schedule for {team}</h3>}
      <ul className="list-group">
        {schedule.map((game) => (
          <li
            key={game.GameID}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>
                {game.AwayTeam} @ {game.HomeTeam}
              </h5>
              <p>
                <strong>Date:</strong> {new Date(game.Day).toLocaleString()}
              </p>
              <p>
                <strong>Stadium:</strong> {game.stadiumInfo.stadium}
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => onSelectGame(game)}
            >
              Select Game
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamSchedule;
