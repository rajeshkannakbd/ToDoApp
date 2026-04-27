import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
  );
});