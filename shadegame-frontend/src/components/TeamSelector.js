import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const TeamSelector = ({ teams, onSelectTeam, selectedTeam }) => {
  const handleTeamSelect = (event) => {
    const selectedAbbreviation = event.target.value;
    onSelectTeam(selectedAbbreviation);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="team-select-label">Select a team</InputLabel>
      <Select
        labelId="team-select-label"
        id="team-select"
        value={selectedTeam}
        label="Select a team"
        onChange={handleTeamSelect}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: "50vh", // 50% of the viewport height
            },
          },
        }}
      >
        {teams.map((team) => (
          <MenuItem key={team.abbreviation} value={team.abbreviation}>
            {team.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TeamSelector;
