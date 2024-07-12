import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const TeamSelector = ({ teams, selectedTeam, onSelectTeam, loading }) => {
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="team-select-label">Select a Team</InputLabel>
      <Select
        labelId="team-select-label"
        id="team-select"
        value={selectedTeam}
        label="Select a Team"
        onChange={(e) => onSelectTeam(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: "50vh", // 50% of the viewport height
            },
          },
        }}
      >
        {teams && teams.length > 0 ? (
          teams.map((team) => (
            <MenuItem key={team.abbreviation} value={team.abbreviation}>
              {team.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No teams available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default TeamSelector;
