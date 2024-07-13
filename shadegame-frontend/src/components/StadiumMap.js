import React, { useEffect, useState } from "react";
import { dataService } from "../services/dataService";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);

  const shadeColors = {
    fullySunny: "#FFD700",
    partialShade: "#FFA500",
    fullyShaded: "#4682B4",
  };

  useEffect(() => {
    const fetchAndProcessSVG = async () => {
      try {
        const response = await fetch(`/svg/stadium_map_${stadiumName}.svg`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Apply shading
        const stadiumData = dataService.getStadiumShadingData(stadiumName);
        if (!stadiumData) {
          throw new Error(`No shading data found for stadium: ${stadiumName}`);
        }

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
            if (!isNaN(x) && !isNaN(y)) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          });
        });

        // Add some padding
        const padding = 50;
        minX = Math.floor(minX) - padding;
        minY = Math.floor(minY) - padding;
        maxX = Math.ceil(maxX) + padding;
        maxY = Math.ceil(maxY) + padding;

        // Set the viewBox to focus on the content
        const width = maxX - minX;
        const height = maxY - minY;

        // Ensure all viewBox values are valid numbers
        if (!isNaN(minX) && !isNaN(minY) && !isNaN(width) && !isNaN(height)) {
          svgElement.setAttribute(
            "viewBox",
            `${minX} ${minY} ${width} ${height}`
          );
        } else {
          console.error("Invalid viewBox values:", {
            minX,
            minY,
            width,
            height,
          });
          throw new Error("Invalid viewBox values calculated");
        }

        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");

        setSvgContent(svgElement.outerHTML);
        setError(null);
      } catch (error) {
        console.error("Error processing SVG:", error);
        setError(`Error processing SVG: ${error.message}`);
        setSvgContent("");
      }
    };

    fetchAndProcessSVG();
  }, [stadiumName, dateTime]);

  const legendStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    marginRight: "20px",
  };

  const colorBoxStyle = {
    width: "20px",
    height: "20px",
    marginRight: "5px",
    border: "1px solid #000",
  };

  if (error) {
    return (
      <div className="stadium-map-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="stadium-map-container">
      <div className="svg-wrapper">
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
      <div className="legend" style={legendStyle}>
        <div className="legend-item" style={legendItemStyle}>
          <span
            className="color-box"
            style={{
              ...colorBoxStyle,
              backgroundColor: shadeColors.fullySunny,
            }}
          ></span>
          <span>Fully Sunny</span>
        </div>
        <div className="legend-item" style={legendItemStyle}>
          <span
            className="color-box"
            style={{
              ...colorBoxStyle,
              backgroundColor: shadeColors.partialShade,
            }}
          ></span>
          <span>Partial Shade</span>
        </div>
        <div className="legend-item" style={legendItemStyle}>
          <span
            className="color-box"
            style={{
              ...colorBoxStyle,
              backgroundColor: shadeColors.fullyShaded,
            }}
          ></span>
          <span>Fully Shaded</span>
        </div>
      </div>
    </div>
  );
};

export default StadiumMap;
