import React from "react";

const GameDetails = ({ game, svgMap }) => {
  if (!game) return null;

  return (
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
      <div
        dangerouslySetInnerHTML={{ __html: svgMap[game.stadiumInfo.stadium] }}
      />
    </div>
  );
};

export default GameDetails;
