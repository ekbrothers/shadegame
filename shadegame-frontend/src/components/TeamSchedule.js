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
import StadiumMap from "./StadiumMap";
import "./TeamSchedule.css";

const TeamSchedule = ({ team }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      <div className="calendar">
        <div className="calendar-header">
          <button
            className="month-nav"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            &lt;
          </button>
          <h3>{format(currentMonth, "MMMM yyyy")}</h3>
          <button
            className="month-nav"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            &gt;
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {[...prefixDays, ...days].map((day, index) => {
            if (!day)
              return (
                <div
                  key={`empty-${index}`}
                  className="calendar-day empty"
                ></div>
              );

            const hasGame = schedule.some((game) =>
              isSameDay(new Date(game.DateTime), day)
            );
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                className={`calendar-day ${hasGame ? "has-game" : ""} 
                            ${isSelected ? "selected" : ""}
                            ${!isCurrentMonth ? "other-month" : ""}`}
                onClick={() => handleDateClick(day)}
              >
                <span className="day-number">{format(day, "d")}</span>
                {hasGame && <span className="game-indicator"></span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="team-schedule">
      <h2 className="schedule-title">Schedule for {team}</h2>
      {renderCalendar()}
      {selectedGame && (
        <div className="game-details">
          <p className="game-teams">
            {selectedGame.AwayTeam} @ {selectedGame.HomeTeam}
          </p>
          <p className="game-date">
            {format(new Date(selectedGame.DateTime), "MMMM d, yyyy")}
          </p>
          <p className="game-time">
            {format(new Date(selectedGame.DateTime), "h:mm a")}
          </p>
          <StadiumMap
            stadiumName={selectedGame.stadiumInfo.stadium.replace(/\s+/g, "")}
            dateTime={selectedGame.DateTime}
          />
        </div>
      )}
    </div>
  );
};

export default TeamSchedule;
