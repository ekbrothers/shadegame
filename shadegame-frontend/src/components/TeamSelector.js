import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";

const TeamSelector = ({ teams, onSelectTeam, selectedTeam }) => {
  const [selectedTeamObj, setSelectedTeamObj] = useState(null);

  useEffect(() => {
    // Update selectedTeamObj when selectedTeam (abbreviation) changes
    if (selectedTeam) {
      const team = teams.find((t) => t.abbreviation === selectedTeam);
      setSelectedTeamObj(team);
    } else {
      setSelectedTeamObj(null);
    }
  }, [selectedTeam, teams]);

  const handleTeamSelect = (event, newValue) => {
    setSelectedTeamObj(newValue);
    if (newValue) {
      onSelectTeam(newValue.abbreviation);
    } else {
      onSelectTeam("");
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
      value={selectedTeamObj}
      onChange={handleTeamSelect}
      isOptionEqualToValue={(option, value) =>
        option.abbreviation === value.abbreviation
      }
    />
  );
};

export default TeamSelector;
