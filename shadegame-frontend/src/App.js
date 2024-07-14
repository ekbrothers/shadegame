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
import Link from "@mui/material/Link";

import LeagueSelector from "./components/LeagueSelector";
import TeamSelector from "./components/TeamSelector";
import TeamSchedule from "./components/TeamSchedule";
import GameDetails from "./components/GameDetails";
import { dataService } from "./services/dataService";
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
    const fetchLeagues = async () => {
      try {
        const leaguesList = await dataService.getLeagues();
        setLeagues(leaguesList);
        setSelectedLeague(leaguesList[0]);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (selectedLeague) {
        try {
          const teamsList = await dataService.getTeams(selectedLeague);
          setTeams(teamsList);
          setSelectedTeam("");
          setSelectedGame(null);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
    };
    fetchTeams();
  }, [selectedLeague]);

  const handleSelectGame = (game) => {
    console.log("Selected game in App:", game);
    setSelectedGame(game);
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setSelectedGame(null);
  };

  const handleLeagueChange = (newLeague) => {
    setSelectedLeague(newLeague);
    setSelectedTeam("");
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
              Pick Your Game
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ mb: 4, textAlign: "left" }}>
            <Typography variant="body2">
              ShadeGrade finds the best seat in every stadium - based on game
              date, time & permanent shade structures.
            </Typography>
          </Box>
          <Box sx={{ mb: 4 }}>
            <LeagueSelector
              leagues={leagues}
              selectedLeague={selectedLeague}
              onSelectLeague={handleLeagueChange}
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
          <Box sx={{ mt: 4, textAlign: "center", pb: 4 }}>
            <Typography variant="body2">
              Want to attend the game? Get your tickets on{" "}
              <Link
                href="https://www.ticketmaster.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ticketmaster
              </Link>
              .
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
