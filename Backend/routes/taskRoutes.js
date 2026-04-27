import express from "express";
import MasterTask from "../models/MasterTask.js";
import DailyLog from "../models/DailyLog.js";

const router = express.Router();

// 👉 Get today's tasks (merged)
router.get("/today/:date", async (req, res) => {
  const { date } = req.params;

  const tasks = await MasterTask.find({
    $or: [{ repeat: "daily" }, { repeat: "once", date }],
  });

  const log = await DailyLog.findOne({ date });

  const merged = tasks.map((t, index) => {
    const existing = log?.tasks?.find((x) => x.taskId === t._id.toString());

    return {
      taskId: t._id.toString(),
      title: t.title,
      type: t.type,
      goal: t.goal,

      completed: existing?.completed || false,
      value: existing?.value || 0,
      streak: existing?.streak || 0,
      bestStreak: existing?.bestStreak || 0,

      // 👇 IMPORTANT FIX
      order: existing?.order !== undefined ? existing.order : index, // 👈 assign order for new tasks
    };
  });

  res.json({ date, tasks: merged });
});

// 👉 Save daily progress + streak logic
router.post("/save", async (req, res) => {
  try {
    const { date, tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks must be array" });
    }

    // ✅ FIX: ensure clean structure + order
    const updated = tasks.map((t, index) => {
      if (!t.taskId) {
        throw new Error("Missing taskId in task");
      }

      return {
        taskId: t.taskId,
        title: t.title,
        type: t.type,
        completed: t.completed || false,
        value: t.value || 0,
        goal: t.goal || 0,
        streak: t.streak || 0,
        bestStreak: t.bestStreak || 0,
        order: index,
      };
    });

    let log = await DailyLog.findOne({ date });

    if (log) {
      log.tasks = updated;
      await log.save();
    } else {
      log = await DailyLog.create({
        date,
        tasks: updated,
      });
    }

    res.json(log);
  } catch (err) {
    console.error("SAVE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// 👉 Add new task
router.post("/add", async (req, res) => {
  const task = await MasterTask.create(req.body);
  res.json(task);
});

// 👉 Weekly data
router.get("/week", async (req, res) => {
  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);

  const logs = await DailyLog.find({
    createdAt: { $gte: last7 },
  });

  res.json(logs);
});

router.get("/month/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const logs = await DailyLog.find({
    date: {
      $gte: start.toISOString().split("T")[0],
      $lte: end.toISOString().split("T")[0],
    },
  });

  res.json(logs);
});

router.get("/insights", async (req, res) => {
  const logs = await DailyLog.find().sort({ date: -1 }).limit(7);

  let totalTasks = 0;
  let completedTasks = 0;

  logs.forEach((d) => {
    d.tasks.forEach((t) => {
      totalTasks++;
      if (t.type === "boolean" ? t.completed : t.value >= t.goal) {
        completedTasks++;
      }
    });
  });

  const percent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  let message = "";

  if (percent > 80) {
    message = "🔥 Excellent consistency this week!";
  } else if (percent > 50) {
    message = "👍 Good, but can improve consistency.";
  } else {
    message = "⚠️ You need to be more consistent.";
  }

  res.json({
    percent,
    message,
  });
});

export default router;
