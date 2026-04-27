import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskId: String,
  title: String,
  type: String,
  completed: Boolean,
  value: Number,
  goal: Number,
  streak: Number,
  bestStreak: Number,
  order: Number // ✅ important
});

const dailyLogSchema = new mongoose.Schema(
  {
    date: String,
    tasks: [taskSchema]
  },
  { timestamps: true }
);

export default mongoose.model("DailyLog", dailyLogSchema);