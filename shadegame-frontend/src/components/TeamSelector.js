import React, { useState, useRef, useEffect } from "react";
import "./TeamSelector.css";

const TeamSelector = ({ teams, onSelectTeam }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    onSelectTeam(team.abbreviation);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="team-selector" ref={dropdownRef}>
      <div className="selected-team" onClick={() => setIsOpen(!isOpen)}>
        {selectedTeam ? (
          <>
            <div
              className="team-circle"
              style={{ backgroundColor: selectedTeam.primaryColor }}
            >
              {getInitials(selectedTeam.name)}
            </div>
            <span>{selectedTeam.name}</span>
          </>
        ) : (
          <span>Select a team</span>
        )}
      </div>
      {isOpen && (
        <div className="team-dropdown">
          <div className="search-bar">
            <div className="search-icon"></div>
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="team-list">
            {filteredTeams.map((team) => (
              <div
                key={team.abbreviation}
                className="team-item"
                onClick={() => handleTeamSelect(team)}
              >
                <div
                  className="team-circle"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {getInitials(team.name)}
                </div>
                <span>{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
