import React, { useState, useEffect } from "react";
import axios from "axios";

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    console.log("Fetching games...");
    axios
      .get("http://localhost:5000/api/games")
      .then((response) => {
        console.log("Games fetched:", response.data);
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Remaining MLB Games for 2024 Season</h2>
      <ul className="list-group">
        {games.map((game) => (
          <li key={game.GameID} className="list-group-item">
            <h5>
              {game.AwayTeam} @ {game.HomeTeam} on{" "}
              {new Date(game.Day).toLocaleString()}
            </h5>
            <p>
              <strong>Stadium:</strong> {game.stadiumInfo.stadium}
            </p>
            <p>
              <strong>Address:</strong> {game.stadiumInfo.address}
            </p>
            <p>
              <strong>Phone:</strong> {game.stadiumInfo.phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={`https://${game.stadiumInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {game.stadiumInfo.website}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
