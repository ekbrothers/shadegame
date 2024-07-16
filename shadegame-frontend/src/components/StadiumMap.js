import React, { useEffect, useState, useRef } from "react";
import { dataService } from "../services/dataService";
import "./StadiumMap.css";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          adjustSvgSize();
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [svgContent]);

  const adjustSvgSize = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const svg = container.querySelector("svg");
      if (svg) {
        const aspectRatio =
          svg.viewBox.baseVal.width / svg.viewBox.baseVal.height;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        if (containerAspectRatio > aspectRatio) {
          svg.style.width = "auto";
          svg.style.height = "100%";
        } else {
          svg.style.width = "100%";
          svg.style.height = "auto";
        }
      }
    }
  };

  const processSVG = (svgText) => {
    console.log("Entering processSVG function");
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    let processedSvgElement = svgDoc.documentElement;

    if (processedSvgElement.tagName === "parsererror") {
      console.error("SVG parsing error:", processedSvgElement.textContent);
      throw new Error("SVG parsing error: " + processedSvgElement.textContent);
    }

    console.log("SVG parsed successfully");

    console.log("Applying shading to SVG");
    const stadiumData = dataService.getStadiumShadingData(stadiumName);
    if (!stadiumData) {
      console.error(`No shading data found for stadium: ${stadiumName}`);
      throw new Error(`No shading data found for stadium: ${stadiumName}`);
    }

    const shading = stadiumData.getShadingForTime(new Date(dateTime));
    console.log("Shading data:", shading);

    const sections = processedSvgElement.querySelectorAll(
      '#stadium-sections [id^="spoly_"]'
    );
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

    console.log("Standardizing SVG");
    try {
      processedSvgElement = standardizeStadiumSVG(processedSvgElement);
    } catch (error) {
      console.error("Error during SVG standardization:", error);
      // We'll continue with the original SVG if standardization fails
    }

    processedSvgElement.classList.add("stadium-svg");

    console.log("Final SVG:", processedSvgElement.outerHTML);
    console.log("Exiting processSVG function");
    return processedSvgElement.outerHTML;
  };

  const standardizeStadiumSVG = (svgElement) => {
    console.log("Entering standardizeStadiumSVG function");

    const mainGroup = svgElement.querySelector("#stadium-sections");
    if (!mainGroup) {
      console.error("Could not find main group with id 'stadium-sections'");
      return svgElement;
    }

    let bbox = mainGroup.getBBox();
    console.log("Original bounding box:", bbox);

    if (
      !isFinite(bbox.width) ||
      !isFinite(bbox.height) ||
      bbox.width === 0 ||
      bbox.height === 0
    ) {
      console.error("Invalid bounding box dimensions, calculating manually");
      bbox = calculateManualBoundingBox(mainGroup);
      console.log("Manually calculated bounding box:", bbox);
    }

    const padding = Math.max(bbox.width, bbox.height) * 0.05;
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    const viewBoxWidth = bbox.width + 2 * padding;
    const viewBoxHeight = bbox.height + 2 * padding;
    const viewBoxX = centerX - viewBoxWidth / 2;
    const viewBoxY = centerY - viewBoxHeight / 2;

    const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;

    svgElement.setAttribute("viewBox", viewBox);
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    console.log(`Set viewBox to: ${viewBox}`);

    const groups = svgElement.querySelectorAll("g");
    groups.forEach((group) => {
      if (group.getAttribute("transform")) {
        console.log(`Removing transform from group:`, group.id);
        group.removeAttribute("transform");
      }
    });

    console.log("Exiting standardizeStadiumSVG function");
    return svgElement;
  };

  const calculateManualBoundingBox = (element) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const polygons = element.querySelectorAll("polygon");

    polygons.forEach((polygon) => {
      const points = polygon.points;
      for (let i = 0; i < points.numberOfItems; i++) {
        const point = points.getItem(i);
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
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
      {error ? (
        <div className="stadium-map-error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <Legend shadeColors={shadeColors} />
          <div
            className="svg-wrapper"
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </>
      )}
    </div>
  );
};

const Legend = ({ shadeColors }) => (
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
