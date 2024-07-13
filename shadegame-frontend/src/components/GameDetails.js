import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { format, parseISO } from "date-fns";
import { dataService } from "../services/dataService";
import StadiumMap from "./StadiumMap";

const GameDetails = ({ game, league }) => {
  if (!game || !league) {
    return null;
  }

  const homeTeam = dataService.getStadiumInfo(league, game.HomeTeam);
  const awayTeam = dataService.getStadiumInfo(league, game.AwayTeam);

  if (!homeTeam || !awayTeam) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography>Game details are not available.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          {awayTeam.team} @ {homeTeam.team}
        </Typography>
        <Typography variant="body1">
          {format(parseISO(game.DateTime), "MMMM d, yyyy 'at' h:mm a")}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body1">{homeTeam.stadium}</Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <StadiumMap
          stadiumName={homeTeam.stadium.replace(/\s+/g, "")}
          dateTime={game.DateTime}
        />
      </Box>
    </Paper>
  );
};

export default GameDetails;
