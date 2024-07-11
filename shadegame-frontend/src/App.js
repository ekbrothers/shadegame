import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import TeamSelector from "./components/TeamSelector";
import TeamSchedule from "./components/TeamSchedule";
import GameDetails from "./components/GameDetails";
import "./App.css";

// Example SVG mappings for stadiums
const svgMap = {
  "Chase Field":
    "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#ccc'/><circle cx='100' cy='100' r='80' fill='#fff' stroke='#000'/><rect x='90' y='50' width='20' height='100' fill='#0f0'/><text x='50%' y='90%' font-size='20' text-anchor='middle' fill='#000'>Stadium</text></svg>",
  "Great American Ball Park":
    "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#ccc'/><circle cx='100' cy='100' r='80' fill='#fff' stroke='#000'/><rect x='90' y='50' width='20' height='100' fill='#0f0'/><text x='50%' y='90%' font-size='20' text-anchor='middle' fill='#000'>Stadium</text></svg>",
  // Add more SVGs for other stadiums...
};

// League data
const leaguesAndTeams = {
  MLB: [
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
  ],
  MLS: [
    { name: "Atlanta United FC", abbreviation: "ATL", primaryColor: "#80000A" },
    { name: "Austin FC", abbreviation: "ATX", primaryColor: "#00B140" },
    { name: "Charlotte FC", abbreviation: "CLT", primaryColor: "#1A85C8" },
    // ... add all MLS teams
  ],
};

const leagues = Object.keys(leaguesAndTeams);

const App = () => {
  const [selectedLeague, setSelectedLeague] = useState("MLB");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLeagueChange = (event) => {
    setSelectedLeague(event.target.value);
    setSelectedTeam(""); // Reset selected team when league changes
    setSelectedGame(null); // Reset selected game when league changes
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ShadeGame Schedule
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ bgcolor: "background.paper", p: 2, textAlign: "center" }}>
          <Typography variant="body2">
            ShadeGame provides sun exposure information for stadium sections
            (full sun, partial shade, full shade) based on shade structures,
            game time, and date.
          </Typography>
        </Box>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="league-select-label">Select a League</InputLabel>
              <Select
                labelId="league-select-label"
                id="league-select"
                value={selectedLeague}
                label="Select a League"
                onChange={handleLeagueChange}
              >
                {leagues.map((league) => (
                  <MenuItem key={league} value={league}>
                    {league}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TeamSelector
              teams={leaguesAndTeams[selectedLeague]}
              onSelectTeam={setSelectedTeam}
              selectedTeam={selectedTeam}
            />
          </Box>
          {selectedTeam && (
            <Box sx={{ mb: 4 }}>
              <TeamSchedule
                team={selectedTeam}
                league={selectedLeague}
                onSelectGame={setSelectedGame}
              />
            </Box>
          )}
          {selectedGame && (
            <Box sx={{ mb: 4 }}>
              <GameDetails game={selectedGame} svgMap={svgMap} />
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
