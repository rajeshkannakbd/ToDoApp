import mongoose from "mongoose";

const taskItemSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["boolean", "numeric"], default: "boolean" },

  completed: { type: Boolean, default: false },

  // for numeric tasks (protein, hours)
  goal: Number,
  value: Number,

  streak: { type: Number, default: 0 }
});

const taskSchema = new mongoose.Schema({
  date: { type: String, required: true },
  tasks: [taskItemSchema]
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);