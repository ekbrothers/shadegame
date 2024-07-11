import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";

const TeamSelector = ({ teams, onSelectTeam }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleTeamSelect = (event, newValue) => {
    setSelectedTeam(newValue);
    if (newValue) {
      onSelectTeam(newValue.abbreviation);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Autocomplete
      options={teams}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label="Select a team" />}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <Avatar sx={{ bgcolor: option.primaryColor, mr: 2 }}>
            {getInitials(option.name)}
          </Avatar>
          {option.name}
        </Box>
      )}
      value={selectedTeam}
      onChange={handleTeamSelect}
      isOptionEqualToValue={(option, value) =>
        option.abbreviation === value.abbreviation
      }
    />
  );
};

export default TeamSelector;
