import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["boolean", "numeric"] },
  goal: Number,

  repeat: { type: String, enum: ["daily", "once"], default: "daily" },
  date: String
},{ timestamps: true }
);

export default mongoose.model("MasterTask", schema);