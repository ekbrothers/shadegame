import React from "react";

const TeamSelector = ({ teams, onSelectTeam }) => {
  return (
    <div className="mb-3">
      <label htmlFor="teamSelector" className="form-label">
        Select a Team
      </label>
      <select
        className="form-select"
        id="teamSelector"
        onChange={(e) => onSelectTeam(e.target.value)}
      >
        <option value="">Select a team...</option>
        {teams.map((team) => (
          <option key={team.abbreviation} value={team.abbreviation}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;
