import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TeamSelector from "./components/TeamSelector";
import TeamSchedule from "./components/TeamSchedule";
import GameDetails from "./components/GameDetails";

// Example SVG mappings for stadiums
const svgMap = {
  "Chase Field":
    "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#ccc'/><circle cx='100' cy='100' r='80' fill='#fff' stroke='#000'/><rect x='90' y='50' width='20' height='100' fill='#0f0'/><text x='50%' y='90%' font-size='20' text-anchor='middle' fill='#000'>Stadium</text></svg>",
  "Great American Ball Park":
    "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#ccc'/><circle cx='100' cy='100' r='80' fill='#fff' stroke='#000'/><rect x='90' y='50' width='20' height='100' fill='#0f0'/><text x='50%' y='90%' font-size='20' text-anchor='middle' fill='#000'>Stadium</text></svg>",
  // Add more SVGs for other stadiums...
};

const teams = [
  { name: "Arizona Diamondbacks", abbreviation: "ARI" },
  { name: "Atlanta Braves", abbreviation: "ATL" },
  { name: "Baltimore Orioles", abbreviation: "BAL" },
  { name: "Boston Red Sox", abbreviation: "BOS" },
  { name: "Chicago Cubs", abbreviation: "CHC" },
  { name: "Chicago White Sox", abbreviation: "CHW" },
  { name: "Cincinnati Reds", abbreviation: "CIN" },
  { name: "Cleveland Guardians", abbreviation: "CLE" },
  { name: "Colorado Rockies", abbreviation: "COL" },
  { name: "Detroit Tigers", abbreviation: "DET" },
  { name: "Houston Astros", abbreviation: "HOU" },
  { name: "Kansas City Royals", abbreviation: "KC" },
  { name: "Los Angeles Angels", abbreviation: "LAA" },
  { name: "Los Angeles Dodgers", abbreviation: "LAD" },
  { name: "Miami Marlins", abbreviation: "MIA" },
  { name: "Milwaukee Brewers", abbreviation: "MIL" },
  { name: "Minnesota Twins", abbreviation: "MIN" },
  { name: "New York Mets", abbreviation: "NYM" },
  { name: "New York Yankees", abbreviation: "NYY" },
  { name: "Oakland Athletics", abbreviation: "OAK" },
  { name: "Philadelphia Phillies", abbreviation: "PHI" },
  { name: "Pittsburgh Pirates", abbreviation: "PIT" },
  { name: "San Diego Padres", abbreviation: "SD" },
  { name: "San Francisco Giants", abbreviation: "SF" },
  { name: "Seattle Mariners", abbreviation: "SEA" },
  { name: "St. Louis Cardinals", abbreviation: "STL" },
  { name: "Tampa Bay Rays", abbreviation: "TB" },
  { name: "Texas Rangers", abbreviation: "TEX" },
  { name: "Toronto Blue Jays", abbreviation: "TOR" },
  { name: "Washington Nationals", abbreviation: "WAS" },
];

const App = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to ShadeGame!</h1>
      <h2 className="text-center">MLB Schedule</h2>
      <TeamSelector teams={teams} onSelectTeam={setSelectedTeam} />
      {selectedTeam && (
        <TeamSchedule team={selectedTeam} onSelectGame={setSelectedGame} />
      )}
      {selectedGame && <GameDetails game={selectedGame} svgMap={svgMap} />}
    </div>
  );
};

export default App;
