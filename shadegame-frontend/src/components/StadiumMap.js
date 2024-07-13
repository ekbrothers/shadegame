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
      if (!stadiumName) {
        console.log("Stadium name not available yet");
        return;
      }

      try {
        console.log(`Fetching SVG for stadium: ${stadiumName}`);
        const normalizedStadiumName = stadiumName
          .toLowerCase()
          .replace(/\s+/g, "-");
        const svgUrl = `/svg/stadium_map_${encodeURIComponent(
          normalizedStadiumName
        )}.svg`;
        console.log(`Attempting to fetch from: ${svgUrl}`);

        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const svgText = await response.text();

        // Process the SVG
        const processedSvg = processSVG(svgText);
        setSvgContent(processedSvg);
        setError(null);
      } catch (error) {
        console.error("Error processing SVG:", error);
        setError(`Error processing SVG: ${error.message}`);
        setSvgContent("");
      }
    };

    fetchAndProcessSVG();
  }, [stadiumName, dateTime]);

  const processSVG = (svgText) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
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

    // Calculate and set viewBox
    const { minX, minY, maxX, maxY } = calculateBoundingBox(sections);
    const padding = 50;
    const width = maxX - minX + 2 * padding;
    const height = maxY - minY + 2 * padding;

    svgElement.setAttribute(
      "viewBox",
      `${minX - padding} ${minY - padding} ${width} ${height}`
    );
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");

    return svgElement.outerHTML;
  };

  const calculateBoundingBox = (sections) => {
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
    return { minX, minY, maxX, maxY };
  };

  const Legend = () => (
    <div className="legend" style={legendStyle}>
      {Object.entries(shadeColors).map(([key, color]) => (
        <div key={key} className="legend-item" style={legendItemStyle}>
          <span
            className="color-box"
            style={{ ...colorBoxStyle, backgroundColor: color }}
          />
          <span>
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </span>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="stadium-map-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="stadium-map-container">
      {error ? (
        <div className="stadium-map-error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div
            className="svg-wrapper"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <Legend />
        </>
      )}
    </div>
  );
};

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

export default StadiumMap;
