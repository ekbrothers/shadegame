import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
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
    return (
      <div className="calendar">
        <div className="calendar-header">
          <button
            onClick={() =>
              setCurrentMonth(
                (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)
              )
            }
          >
            Previous
          </button>
          <h3>{format(currentMonth, "MMMM yyyy")}</h3>
          <button
            onClick={() =>
              setCurrentMonth(
                (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1)
              )
            }
          >
            Next
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const hasGame = schedule.some((game) =>
              isSameDay(new Date(game.DateTime), day)
            );
            return (
              <div
                key={day.toString()}
                className={`calendar-day ${hasGame ? "has-game" : ""} ${
                  isSameDay(day, selectedDate) ? "selected" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="team-schedule">
      <h3>Schedule for {team}</h3>
      {renderCalendar()}
      {selectedGame && (
        <div className="game-details">
          <h4>
            {selectedGame.AwayTeam} @ {selectedGame.HomeTeam}
          </h4>
          <p>Date: {format(new Date(selectedGame.DateTime), "MMMM d, yyyy")}</p>
          <p>Time: {format(new Date(selectedGame.DateTime), "h:mm a")}</p>
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
