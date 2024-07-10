import React, { useEffect, useState } from "react";
import { getStadiumShadingData } from "../data/stadiums";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [error, setError] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const stadiumData = getStadiumShadingData(stadiumName);

  const shadeColors = {
    fullySunny: "#FFD700",
    partialShade: "#FFA500",
    fullyShaded: "#4682B4",
  };

  useEffect(() => {
    if (stadiumName) {
      console.log(`Fetching SVG for stadium: ${stadiumName}`);
      fetch(`/svg/stadium_map_${stadiumName}.svg`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          console.log("SVG data received, length:", data.length);
          if (data.includes("<svg")) {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(data, "image/svg+xml");
            const svgElement = svgDoc.documentElement;

            console.log("SVG parsed successfully:", svgElement);

            // Remove width and height attributes
            svgElement.removeAttribute("width");
            svgElement.removeAttribute("height");

            // Ensure viewBox attribute
            if (!svgElement.getAttribute("viewBox")) {
              svgElement.setAttribute("viewBox", "0 0 100000 100000");
            }

            // Apply shading
            const shading = stadiumData.getShadingForTime(new Date(dateTime));
            const sections = svgElement.querySelectorAll('[id^="spoly_"]');
            sections.forEach((section) => {
              const sectionId = section.getAttribute("data-sectionid");
              let fill;
              if (shading.fullySunny.includes(sectionId)) {
                fill = shadeColors.fullySunny;
              } else if (shading.partialShade.includes(sectionId)) {
                fill = shadeColors.partialShade;
              } else if (shading.fullyShaded.includes(sectionId)) {
                fill = shadeColors.fullyShaded;
              }
              if (fill) {
                section.setAttribute("fill", fill);
              }
            });

            setSvgContent(svgElement.outerHTML);
            console.log("SVG content set");
          } else {
            throw new Error("Invalid SVG content");
          }
        })
        .catch((error) => {
          console.error(`Error loading stadium SVG: ${error}`);
          setError(`Failed to load stadium map: ${error.message}`);
        });
    }
  }, [stadiumName, dateTime, stadiumData]);

  const formatStadiumName = (name) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <div className="stadium-map-container">
      <h2 className="stadium-name">
        {formatStadiumName(stadiumName)} Seating Chart
      </h2>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : svgContent ? (
        <div
          className="svg-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <p>Loading stadium map...</p>
      )}
    </div>
  );
};

export default StadiumMap;
