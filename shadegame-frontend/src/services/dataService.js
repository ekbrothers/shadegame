import { stadiums, mockSchedule } from "../data";

const API_BASE_URL = "http://localhost:5000/api"; // Change this when you have a real backend

export const dataService = {
  getLeagues: async () => {
    // When using a backend, this would be:
    // const response = await fetch(`${API_BASE_URL}/leagues`);
    // return await response.json();

    return Object.keys(stadiums);
  },

  getTeams: async (league) => {
    // When using a backend:
    // const response = await fetch(`${API_BASE_URL}/teams?league=${league}`);
    // return await response.json();

    return Object.entries(stadiums[league]).map(([abbr, data]) => ({
      abbreviation: abbr,
      name: data.team,
    }));
  },

  getSchedule: async (league, team) => {
    // When using a backend:
    // const response = await fetch(`${API_BASE_URL}/games?league=${league}&team=${team}`);
    // return await response.json();

    return mockSchedule.filter(
      (game) =>
        game.League === league &&
        (game.HomeTeam === team || game.AwayTeam === team)
    );
  },

  getStadiumInfo: (league, team) => {
    // This might not need to change when moving to a backend,
    // unless you decide to store stadium info separately
    return stadiums[league][team];
  },
};
