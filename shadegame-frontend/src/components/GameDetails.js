import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { format, parseISO } from "date-fns";
import { dataService } from "../services/dataService";

const GameDetails = ({ game, league }) => {
  if (!game) return null;

  const homeTeam = dataService.getStadiumInfo(league, game.HomeTeam);
  const awayTeam = dataService.getStadiumInfo(league, game.AwayTeam);

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
    </Paper>
  );
};

export default GameDetails;
