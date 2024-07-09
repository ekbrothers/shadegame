// src/components/TeamSchedule.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import StadiumMap from "./StadiumMap";

const TeamSchedule = ({ team }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

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
                <strong>Date:</strong>{" "}
                {new Date(game.DateTime).toLocaleString()}
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setSelectedGame(game)}
            >
              Select Game
            </button>
          </li>
        ))}
      </ul>
      {selectedGame && (
        <StadiumMap
          stadiumName={selectedGame.stadiumInfo.stadium.replace(/\s+/g, "")}
          dateTime={selectedGame.DateTime}
        />
      )}
    </div>
  );
};

export default TeamSchedule;
