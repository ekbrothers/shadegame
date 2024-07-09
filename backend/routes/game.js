const express = require("express");
const router = express.Router();
const mockSchedule = require("../data/mockSchedule.json");
const stadiums = require("../data/stadiums.json");

// Serve the mock schedule data with stadium info
router.get("/games", (req, res) => {
  try {
    const enrichedSchedule = mockSchedule.map((game) => {
      const homeTeamStadium = stadiums[game.HomeTeam];
      return {
        ...game,
        stadiumInfo: homeTeamStadium,
      };
    });
    res.json(enrichedSchedule);
  } catch (error) {
    console.error("Error fetching mock games:", error);
    res.status(500).json({ error: "Failed to fetch mock games" });
  }
});

module.exports = router;
