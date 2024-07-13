import axios from "axios";

const BASE_URL = "https://statsapi.mlb.com/api/v1";

export const mlbService = {
  getSchedule: async (startDate, endDate, teamId) => {
    try {
      const response = await axios.get(`${BASE_URL}/schedule`, {
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
  },
};
