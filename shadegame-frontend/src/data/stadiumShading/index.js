import { GreatAmericanBallPark } from "./GreatAmericanBallPark";
// Import other stadiums as you add them
import { WrigleyField } from "./WrigleyField";
// import { FenwayPark } from './FenwayPark';

export const stadiumShadingData = {
  GreatAmericanBallPark,
  WrigleyField,
  // FenwayPark,
  // Add other stadiums here as you create them
};

export const getStadiumShadingData = (stadiumName) => {
  const formattedName = stadiumName.replace(/\s+/g, "");
  return stadiumShadingData[formattedName] || null;
};
