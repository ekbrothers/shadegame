const express = require("express");
const router = express.Router();
const stadiums = require("../data/stadiums.json");

router.get("/leagues", (req, res) => {
  try {
    const leagues = Object.keys(stadiums);
    res.json(leagues);
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ error: "Failed to fetch leagues" });
  }
});

router.get("/teams", (req, res) => {
  try {
    const { league } = req.query;
    if (!league || !stadiums[league]) {
      return res.status(400).json({ error: "Invalid league" });
    }
    const teams = Object.entries(stadiums[league]).map(([abbr, data]) => ({
      abbreviation: abbr,
      name: data.team,
    }));
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.get("/stadiums", (req, res) => {
  try {
    const { league, team } = req.query;
    if (league && team) {
      if (!stadiums[league] || !stadiums[league][team]) {
        return res.status(400).json({ error: "Invalid league or team" });
      }
      res.json(stadiums[league][team]);
    } else if (league) {
      if (!stadiums[league]) {
        return res.status(400).json({ error: "Invalid league" });
      }
      res.json(stadiums[league]);
    } else {
      res.json(stadiums);
    }
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    res.status(500).json({ error: "Failed to fetch stadiums" });
  }
});

module.exports = router;
