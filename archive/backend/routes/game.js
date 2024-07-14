const express = require("express");
const router = express.Router();
const mockSchedule = require("../data/mockSchedule.json");
const stadiums = require("../data/stadiums.json");

router.get("/games", (req, res) => {
  try {
    const { team, league } = req.query;
    let filteredSchedule = mockSchedule;

    if (team) {
      filteredSchedule = mockSchedule.filter(
        (game) => game.HomeTeam === team || game.AwayTeam === team
      );
    }

    const enrichedSchedule = filteredSchedule.map((game) => {
      const homeTeamLeague = Object.keys(stadiums).find(
        (l) => stadiums[l][game.HomeTeam]
      );
      const homeTeamStadium = homeTeamLeague
        ? stadiums[homeTeamLeague][game.HomeTeam]
        : null;
      return {
        ...game,
        stadiumInfo: homeTeamStadium,
      };
    });

    console.log("Filtered Schedule:", filteredSchedule);
    console.log("Enriched Schedule:", enrichedSchedule);

    if (league) {
      const leagueTeams = Object.keys(stadiums[league]);
      const leagueSchedule = enrichedSchedule.filter(
        (game) =>
          leagueTeams.includes(game.HomeTeam) ||
          leagueTeams.includes(game.AwayTeam)
      );
      res.json(leagueSchedule);
    } else {
      res.json(enrichedSchedule);
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

module.exports = router;
