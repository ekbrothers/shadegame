import React, { useEffect, useState } from "react";
import { getStadiumShadingData } from "../data/stadiums";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState("");
  const [viewBox, setViewBox] = useState("");
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

        // Extract and set viewBox
        const originalViewBox = svgElement.getAttribute("viewBox");
        setViewBox(originalViewBox || "0 0 1000 1000"); // Default if not present

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

        // Remove the outer svg tag, we'll add it back in the render
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        setSvgContent(svgElement.innerHTML);
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
      <div className="svg-container">
        <svg
          viewBox={viewBox}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
      <div className="debug-info">
        <p>{debugInfo}</p>
      </div>
    </div>
  );
};

export default StadiumMap;
