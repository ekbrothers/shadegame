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
import CircularProgress from "@mui/material/CircularProgress";

import LeagueSelector from "./components/LeagueSelector";
import TeamSelector from "./components/TeamSelector";
import TeamSchedule from "./components/TeamSchedule";
import GameDetails from "./components/GameDetails";
import { stadiums } from "./data";
import "./App.css";

const App = () => {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const leaguesList = Object.keys(stadiums);
    setLeagues(leaguesList);
    setSelectedLeague(leaguesList[0]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      const teamsList = Object.entries(stadiums[selectedLeague]).map(
        ([abbr, data]) => ({
          abbreviation: abbr,
          name: data.team,
        })
      );
      setTeams(teamsList);
      setSelectedTeam("");
      setSelectedGame(null);
    }
  }, [selectedLeague]);

  const handleSelectGame = (game) => {
    console.log("Selected game in App:", game);
    setSelectedGame(game);
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setSelectedGame(null);
  };

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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Multi-League Schedule
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <LeagueSelector
              leagues={leagues}
              selectedLeague={selectedLeague}
              onSelectLeague={setSelectedLeague}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <TeamSelector
              teams={teams}
              selectedTeam={selectedTeam}
              onSelectTeam={handleSelectTeam}
            />
          </Box>
          {selectedLeague && selectedTeam && (
            <Box sx={{ mb: 4 }}>
              <TeamSchedule
                team={selectedTeam}
                league={selectedLeague}
                onSelectGame={handleSelectGame}
              />
            </Box>
          )}
          {selectedGame && (
            <Box sx={{ mb: 4 }}>
              <GameDetails game={selectedGame} league={selectedLeague} />
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
