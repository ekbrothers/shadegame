const express = require("express");
const cors = require("cors");
const app = express();
const gameRoutes = require("./routes/game");
const leagueRoutes = require("./routes/league");

app.use(cors());
app.use("/api", gameRoutes);
app.use("/api", leagueRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
