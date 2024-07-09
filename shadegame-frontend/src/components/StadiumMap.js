import React, { useEffect, useState } from "react";
import { getStadiumShadingData } from "../data/stadiums";

const StadiumMap = ({ stadiumName, dateTime }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [error, setError] = useState(null);
  const stadiumData = getStadiumShadingData(stadiumName);

  useEffect(() => {
    if (stadiumName) {
      fetch(`/svg/stadium_map_${stadiumName}.svg`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          console.log("SVG Content Loaded:", data);
          if (
            data.trim().startsWith("<svg") &&
            data.trim().endsWith("</svg>")
          ) {
            setSvgContent(data);
          } else {
            throw new Error("Invalid SVG content");
          }
        })
        .catch((error) => {
          console.error(`Error loading stadium SVG: ${error}`);
          setError(`Failed to load stadium map: ${error.message}`);
        });
    }
  }, [stadiumName]);

  useEffect(() => {
    if (svgContent && stadiumData) {
      try {
        console.log("Parsing SVG Content");
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
        const parseError = svgDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("SVG parsing error");
        }

        const svgElement = svgDoc.querySelector("svg");
        if (svgElement) {
          console.log("SVG Element found:", svgElement);

          const gameTime = new Date(dateTime);
          const shading = stadiumData.getShadingForTime(gameTime);

          // Apply shading to SVG
          Object.entries(shading).forEach(([shadeType, areas]) => {
            areas.forEach((area) => {
              const elements = svgElement.querySelectorAll(
                `[data-area="${area}"]`
              );
              elements.forEach((element) => {
                switch (shadeType) {
                  case "fullySunny":
                    element.setAttribute("fill", "yellow");
                    break;
                  case "partialShade":
                    element.setAttribute("fill", "orange");
                    break;
                  case "fullyShaded":
                    element.setAttribute("fill", "blue");
                    break;
                }
              });
            });
          });

          console.log("Modified SVG Element:", svgElement.outerHTML);
          setSvgContent(svgElement.outerHTML);
        } else {
          throw new Error("No SVG element found in the loaded content");
        }
      } catch (error) {
        console.error("Error processing SVG:", error);
        setError(`Error processing stadium map: ${error.message}`);
      }
    }
  }, [svgContent, dateTime, stadiumData]);

  return (
    <div className="container mt-5">
      <h2>Stadium Seating Chart: {stadiumName}</h2>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : svgContent ? (
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      ) : (
        <p>Loading stadium map...</p>
      )}
    </div>
  );
};

export default StadiumMap;
