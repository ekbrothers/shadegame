import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { format, parseISO } from "date-fns";
import { stadiums } from "../data";

const GameDetails = ({ game, league }) => {
  if (!game) return null;

  const homeTeam = stadiums[league][game.HomeTeam];
  const awayTeam = stadiums[league][game.AwayTeam];

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          {awayTeam.team} @ {homeTeam.team}
        </Typography>
        <Typography>
          {format(parseISO(game.DateTime), "MMMM d, yyyy 'at' h:mm a")}
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Stadium Information</Typography>
        <Typography>{homeTeam.stadium}</Typography>
        <Typography>{homeTeam.address}</Typography>
        <Typography>Phone: {homeTeam.phone}</Typography>
        <Typography>
          Website:{" "}
          <a
            href={`https://${homeTeam.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {homeTeam.website}
          </a>
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1">Game Information</Typography>
        <Typography>Season: {game.Season}</Typography>
        <Typography>Status: {game.Status}</Typography>
        {game.SeriesInfo && (
          <Typography>Series Info: {game.SeriesInfo}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default GameDetails;
