import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import StadiumMap from "./StadiumMap";

const TeamSchedule = ({ team }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const theme = useTheme();

  useEffect(() => {
    if (team) {
      axios
        .get(`http://localhost:5000/api/games`)
        .then((response) => {
          const teamSchedule = response.data.filter(
            (game) => game.HomeTeam === team || game.AwayTeam === team
          );
          setSchedule(teamSchedule);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    }
  }, [team]);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const game = schedule.find((game) =>
      isSameDay(new Date(game.DateTime), date)
    );
    setSelectedGame(game || null);
  };

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

            const hasGame = schedule.some((game) =>
              isSameDay(new Date(game.DateTime), day)
            );
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
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: isSelected
                          ? "common.white"
                          : theme.palette.secondary.main,
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Schedule for {team}
      </Typography>
      {renderCalendar()}
      {selectedGame && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {selectedGame.AwayTeam} @ {selectedGame.HomeTeam}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {format(new Date(selectedGame.DateTime), "MMMM d, yyyy")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {format(new Date(selectedGame.DateTime), "h:mm a")}
          </Typography>
          <StadiumMap
            stadiumName={selectedGame.stadiumInfo.stadium.replace(/\s+/g, "")}
            dateTime={selectedGame.DateTime}
          />
        </Paper>
      )}
    </Box>
  );
};

export default TeamSchedule;
