// src/data/stadiums/index.js

const greatAmericanBallparkShading = {
  name: "Great American Ball Park",
  orientation: "southeast",
  shadeData: {
    morning: {
      fullySunny: ["outfield", "3rd-base-line"],
      partialShade: ["1st-base-line"],
      fullyShaded: ["300-level-club"],
    },
    earlyAfternoon: {
      fullySunny: ["outfield", "3rd-base-line"],
      partialShade: ["1st-base-line"],
      fullyShaded: ["300-level-club", "back-rows-upper-deck"],
    },
    lateAfternoon: {
      fullySunny: ["left-field", "3rd-base-line"],
      partialShade: ["home-plate"],
      fullyShaded: ["300-level-club", "1st-base-line"],
    },
    evening: {
      fullySunny: ["outfield"],
      partialShade: [],
      fullyShaded: [
        "300-level-club",
        "1st-base-line",
        "3rd-base-line",
        "home-plate",
      ],
    },
  },
  getShadingForTime: function (time) {
    const hour = time.getHours();
    if (hour < 12) return this.shadeData.morning;
    if (hour < 14) return this.shadeData.earlyAfternoon;
    if (hour < 17) return this.shadeData.lateAfternoon;
    return this.shadeData.evening;
  },
};

export const stadiumShadingData = {
  GreatAmericanBallPark: greatAmericanBallparkShading,
  // Add more stadiums here as you create them
};

export const getStadiumShadingData = (stadiumName) => {
  const formattedName = stadiumName.replace(/\s+/g, "");
  return stadiumShadingData[formattedName] || null;
};
