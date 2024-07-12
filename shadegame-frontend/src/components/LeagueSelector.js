import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { dataService } from "../services/dataService";

const LeagueSelector = ({ selectedLeague, onSelectLeague }) => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const fetchedLeagues = await dataService.getLeagues();
        setLeagues(fetchedLeagues);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

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
