import React, { useEffect, useState } from "react";
import { dataService } from "../services/dataService";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);

  const shadeColors = {
    fullSun: "#FFD700",
    partialShade: "#FFA500",
    fullShade: "#4682B4",
  };

  useEffect(() => {
    const fetchAndProcessSVG = async () => {
      if (!stadiumName) {
        console.log("Stadium name not available yet");
        return;
      }

      console.log(`Starting SVG fetch and process for stadium: ${stadiumName}`);
      console.log(`Current dateTime: ${dateTime}`);

      try {
        const normalizedStadiumName = stadiumName
          .toLowerCase()
          .replace(/\s+/g, "-");
        const svgUrl = `/svg/stadium_map_${encodeURIComponent(
          normalizedStadiumName
        )}.svg`;
        console.log(`Attempting to fetch SVG from: ${svgUrl}`);

        const response = await fetch(svgUrl);
        console.log(`Fetch response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const svgText = await response.text();
        console.log(`SVG text fetched, length: ${svgText.length} characters`);

        console.log("Starting SVG processing");
        const processedSvg = processSVG(svgText);
        console.log("SVG processing completed");

        setSvgContent(processedSvg);
        setError(null);
      } catch (error) {
        console.error("Error in fetchAndProcessSVG:", error);
        setError(`Error processing SVG: ${error.message}`);
        setSvgContent("");
      }
    };

    fetchAndProcessSVG();
  }, [stadiumName, dateTime]);

  const processSVG = (svgText) => {
    console.log("Entering processSVG function");
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    console.log("Applying shading to SVG");
    const stadiumData = dataService.getStadiumShadingData(stadiumName);
    if (!stadiumData) {
      console.error(`No shading data found for stadium: ${stadiumName}`);
      throw new Error(`No shading data found for stadium: ${stadiumName}`);
    }

    const shading = stadiumData.getShadingForTime(new Date(dateTime));
    console.log("Shading data:", shading);

    const sections = svgElement.querySelectorAll('[id^="spoly_"]');
    console.log(`Found ${sections.length} sections to shade`);

    sections.forEach((section) => {
      const sectionId = section.getAttribute("data-sectionid");
      let fill;
      if (shading.fullSun.includes(sectionId)) {
        fill = shadeColors.fullSun;
      } else if (shading.partialShade.includes(sectionId)) {
        fill = shadeColors.partialShade;
      } else if (shading.fullShade.includes(sectionId)) {
        fill = shadeColors.fullShade;
      }
      if (fill) {
        section.setAttribute("fill", fill);
        console.log(`Applied ${fill} to section ${sectionId}`);
      } else {
        console.log(`No shading applied to section ${sectionId}`);
      }
    });

    console.log("Calculating bounding box");
    const { minX, minY, maxX, maxY } = calculateBoundingBox(sections);
    const padding = 50;
    const width = maxX - minX + 2 * padding;
    const height = maxY - minY + 2 * padding;

    const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;
    console.log(`Setting viewBox to: ${viewBox}`);
    svgElement.setAttribute("viewBox", viewBox);
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");

    console.log("Exiting processSVG function");
    return svgElement.outerHTML;
  };

  const calculateBoundingBox = (sections) => {
    console.log("Calculating bounding box for sections");
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
    console.log(`Bounding box: (${minX}, ${minY}) to (${maxX}, ${maxY})`);
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
