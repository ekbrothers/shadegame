import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { stadiums } from "../data"; // Adjust the import path as needed

const LeagueSelector = ({ selectedLeague, onSelectLeague }) => {
  const leagues = Object.keys(stadiums);

  return (
    <FormControl fullWidth>
      <InputLabel id="league-select-label">Select a League</InputLabel>
      <Select
        labelId="league-select-label"
        id="league-select"
        value={selectedLeague}
        label="Select a League"
        onChange={(e) => onSelectLeague(e.target.value)}
      >
        {leagues.map((league) => (
          <MenuItem key={league} value={league}>
            {league}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LeagueSelector;
