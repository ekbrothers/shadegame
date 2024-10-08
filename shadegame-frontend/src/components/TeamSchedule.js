import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
  startOfYear,
  endOfYear,
} from "date-fns";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { dataService } from "../services/dataService";

const TeamSchedule = ({ team, league, onSelectGame }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Refined color definitions based on common practices
  const homeGameColor = theme.palette.mode === "light" ? "#2E7D32" : "#4CAF50"; // Darker green for light mode, lighter green for dark mode
  const awayGameColor = theme.palette.mode === "light" ? "#1565C0" : "#42A5F5"; // Darker blue for light mode, lighter blue for dark mode

  useEffect(() => {
    const fetchSchedule = async () => {
      if (team && league) {
        setLoading(true);
        setError(null);
        try {
          console.log(
            `Fetching schedule for team: ${team} in league: ${league}`
          );
          const startDate = format(startOfYear(new Date()), "yyyy-MM-dd");
          const endDate = format(endOfYear(new Date()), "yyyy-MM-dd");
          const scheduleData = await dataService.getSchedule(
            league,
            team,
            startDate,
            endDate
          );

          let formattedSchedule;
          if (league === "MLB") {
            formattedSchedule = scheduleData.dates.flatMap((date) =>
              date.games.map((game) => ({
                ...game,
                DateTime: game.gameDate,
                HomeTeam: game.teams.home.team.abbreviation,
                AwayTeam: game.teams.away.team.abbreviation,
              }))
            );
          } else {
            formattedSchedule = scheduleData;
          }

          console.log("Formatted schedule:", formattedSchedule);
          setSchedule(formattedSchedule);
        } catch (error) {
          console.error("Error fetching schedule:", error);
          setError("Failed to fetch schedule. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSchedule();
  }, [team, league]);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const gamesOnThisDay = schedule.filter((game) =>
      isSameDay(parseISO(game.DateTime), date)
    );
    if (gamesOnThisDay.length > 0) {
      onSelectGame(gamesOnThisDay[0]); // Select the first game if multiple games on the same day
    } else {
      onSelectGame(null);
    }
  };

  const renderLegend = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: homeGameColor,
            mr: 1,
          }}
        />
        <Typography variant="body2">Home Game</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: awayGameColor,
            mr: 1,
          }}
        />
        <Typography variant="body2">Away Game</Typography>
      </Box>
    </Box>
  );

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const firstDayOfMonth = startOfMonth(currentMonth);
    const prefixDays = Array(firstDayOfMonth.getDay()).fill(null);

    return (
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <IconButton
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        {renderLegend()}
        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid item xs={1.7} key={day}>
              <Typography variant="subtitle2" align="center">
                {day}
              </Typography>
            </Grid>
          ))}
          {[...prefixDays, ...days].map((day, index) => {
            if (!day) return <Grid item xs={1.7} key={`empty-${index}`} />;

            const gamesOnThisDay = schedule.filter((game) =>
              isSameDay(parseISO(game.DateTime), day)
            );
            const hasGame = gamesOnThisDay.length > 0;
            const isHomeGame = hasGame && gamesOnThisDay[0].HomeTeam === team;
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <Grid item xs={1.7} key={day.toString()}>
                <Paper
                  elevation={isSelected ? 8 : 1}
                  sx={{
                    p: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    bgcolor: isSelected
                      ? theme.palette.primary.main
                      : "background.paper",
                    color: isSelected
                      ? "common.white"
                      : isCurrentMonth
                      ? "text.primary"
                      : "text.disabled",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  <Typography variant="body2">{format(day, "d")}</Typography>
                  {hasGame && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: isSelected
                          ? "common.white"
                          : isHomeGame
                          ? homeGameColor
                          : awayGameColor,
                        mt: 0.5,
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", color: "error.main" }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return <Box>{renderCalendar()}</Box>;
};

export default TeamSchedule;
