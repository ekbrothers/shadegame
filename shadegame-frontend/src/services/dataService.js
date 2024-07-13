import { stadiums } from "../data";
import { mockSchedule } from "../data/mockSchedule";
import { stadiumShadingData, getStadiumShadingData } from "./stadiumShading";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change this when you have a real backend
const MLB_API_BASE_URL = "https://statsapi.mlb.com/api/v1";

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

  getSchedule: async (league, team, startDate, endDate) => {
    if (league === "MLB") {
      try {
        const teamId = stadiums[league][team].teamId;
        const response = await axios.get(`${MLB_API_BASE_URL}/schedule`, {
          params: {
            hydrate: "team,lineups",
            sportId: 1,
            startDate,
            endDate,
            teamId,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching MLB schedule:", error);
        throw error;
      }
    } else {
      // Use mock schedule for non-MLB leagues
      return mockSchedule.filter(
        (game) =>
          game.League === league &&
          (game.HomeTeam === team || game.AwayTeam === team)
      );
    }
  },

  getStadiumInfo: (league, team) => {
    // This might not need to change when moving to a backend,
    // unless you decide to store stadium info separately
    return stadiums[league][team];
  },

  getStadiumShadingData: (stadiumName) => {
    return getStadiumShadingData(stadiumName);
  },
};
