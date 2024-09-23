const express = require("express");
const Match = require("../Model/Match");
const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const match = new Match();
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Error initializing match" });
  }
});

router.get("/current", async (req, res) => {
  try {
    const match = await Match.findOne().sort({ _id: -1 });
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Error fetching match data" });
  }
});

router.post("/ball", async (req, res) => {
  const { run_scored, is_wicket } = req.body;
  try {
    let match = await Match.findOne().sort({ _id: -1 });

    let currentOver = match.overs[match.overs.length - 1];
    if (!currentOver || currentOver.balls.length === 6) {
      currentOver = { over_number: match.current_over++, balls: [] };
      match.overs.push(currentOver);
    }

    currentOver.balls.push({
      run_scored,
      is_wicket,
      ball_number: currentOver.balls.length + 1,
    });
    match.total_runs += run_scored;
    if (is_wicket) match.total_wickets += 1;

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Error updating ball" });
  }
});

router.post("/initialize", async (req, res) => {
  try {
    await Match.deleteMany({});

    const newMatch = new Match({
      total_runs: 0,
      total_wickets: 0,
      current_over: 0,
    });

    await newMatch.save();
    res.json(newMatch);
  } catch (error) {
    console.error("Error initializing match:", error);
    res.status(500).json({ error: "Error initializing match" });
  }
});

module.exports = router;
