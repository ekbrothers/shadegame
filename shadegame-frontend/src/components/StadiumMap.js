import React, { useEffect } from "react";

const StadiumMap = () => {
  useEffect(() => {
    const sections = document.querySelectorAll("rect");
    sections.forEach((section) => {
      section.addEventListener("click", () =>
        alert(`Section ${section.id} clicked`)
      );
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Great American Ballpark Seating Chart</h2>
      <svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          id="A1"
          x="50"
          y="50"
          width="100"
          height="100"
          fill="yellow"
          stroke="black"
        />
        <rect
          id="A2"
          x="200"
          y="50"
          width="100"
          height="100"
          fill="orange"
          stroke="black"
        />
        <rect
          id="A3"
          x="350"
          y="50"
          width="100"
          height="100"
          fill="lightgrey"
          stroke="black"
        />
      </svg>
    </div>
  );
};

export default StadiumMap;
