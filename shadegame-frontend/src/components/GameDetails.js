import React from "react";
import "./GameDetails.css";

const GameDetails = ({ game, svgMap }) => {
  if (!game) return null;

  const gameDate = new Date(game.Day);
  const formattedDate = gameDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="game-details">
      <div className="game-header">
        <h2 className="game-title">
          {game.AwayTeam} @ {game.HomeTeam}
        </h2>
        <div className="game-subtitle">{formattedDate}</div>
      </div>
      <div className="game-info">
        <div className="info-item">
          <span className="info-label">Stadium:</span>
          <span className="info-value">{game.stadiumInfo.stadium}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Location:</span>
          <span className="info-value">{game.stadiumInfo.location}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Capacity:</span>
          <span className="info-value">
            {game.stadiumInfo.capacity.toLocaleString()} seats
          </span>
        </div>
      </div>
      <div className="stadium-map">
        <h3>Stadium Map</h3>
        <div
          className="svg-container"
          dangerouslySetInnerHTML={{ __html: svgMap[game.stadiumInfo.stadium] }}
        />
      </div>
    </div>
  );
};

export default GameDetails;
