const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({
  run_scored: { type: Number, default: 0 },
  is_wicket: { type: Boolean, default: false },
  ball_number: Number,
});

const overSchema = new mongoose.Schema({
  over_number: Number,
  balls: [ballSchema],
});

const matchSchema = new mongoose.Schema({
  total_runs: { type: Number, default: 0 },
  total_wickets: { type: Number, default: 0 },
  current_over: { type: Number, default: 1 },
  overs: [overSchema],
});

module.exports = mongoose.model("Match", matchSchema);
