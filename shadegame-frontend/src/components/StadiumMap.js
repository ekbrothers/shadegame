import React, { useEffect, useState } from "react";
import { getStadiumShadingData } from "../data/stadiums";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const shadeColors = {
    fullySunny: "#FFD700",
    partialShade: "#FFA500",
    fullyShaded: "#4682B4",
  };

  useEffect(() => {
    fetch(`/svg/stadium_map_${stadiumName}.svg`)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Apply shading
        const stadiumData = getStadiumShadingData(stadiumName);
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

        // Find the bounding box of all the polygons
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        sections.forEach((section) => {
          const points = section.getAttribute("points").split(" ");
          points.forEach((point) => {
            const [x, y] = point.split(",").map(Number);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          });
        });

        // Add some padding
        const padding = 50;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        // Set the viewBox to focus on the content
        const width = maxX - minX;
        const height = maxY - minY;
        svgElement.setAttribute(
          "viewBox",
          `${minX} ${minY} ${width} ${height}`
        );
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");

        setSvgContent(svgElement.outerHTML);
        setDebugInfo(
          `Shading applied for ${dateTime}. Sections shaded: ${sections.length}`
        );
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
        setDebugInfo(`Error loading SVG: ${error.message}`);
      });
  }, [stadiumName, dateTime]);

  return (
    <div className="stadium-map-container">
      <h2>{stadiumName} Seating Chart</h2>
      <div className="svg-wrapper">
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
      <div className="debug-info">
        <p>{debugInfo}</p>
      </div>
    </div>
  );
};

export default StadiumMap;
