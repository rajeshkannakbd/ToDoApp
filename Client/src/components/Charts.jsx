import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getWeek } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Charts() {
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getWeek();
    const logs = res.data;

    // 📈 Line Chart (daily completion count)
    const line = logs.map((d) => ({
      date: d.date.slice(5),
      done: d.tasks.filter((t) =>
        t.type === "boolean"
          ? t.completed
          : t.value >= t.goal
      ).length
    }));

    // 📊 Bar Chart (completion % per day)
    const bar = logs.map((d) => {
      const total = d.tasks.length;
      const done = d.tasks.filter((t) =>
        t.type === "boolean"
          ? t.completed
          : t.value >= t.goal
      ).length;

      return {
        date: d.date.slice(5),
        percent: total ? Math.round((done / total) * 100) : 0
      };
    });

    // 🧠 Task-wise analysis
    const taskMap = {};

    logs.forEach((d) => {
      d.tasks.forEach((t) => {
        if (!taskMap[t.title]) {
          taskMap[t.title] = { total: 0, done: 0 };
        }

        taskMap[t.title].total++;

        const completed =
          t.type === "boolean"
            ? t.completed
            : t.value >= t.goal;

        if (completed) taskMap[t.title].done++;
      });
    });

    const taskStats = Object.keys(taskMap).map((key) => ({
      name: key,
      percent: Math.round(
        (taskMap[key].done / taskMap[key].total) * 100
      )
    }));

    setLineData(line);
    setBarData(bar);
    setTaskData(taskStats);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 text-white space-y-6"
    >
      <h1 className="text-xl font-bold">📊 Analytics</h1>

      {/* 📈 LINE CHART */}
      <div className="bg-gray-900 p-4 rounded">
        <h2 className="mb-2 text-sm text-gray-400">
          Daily Completed Tasks
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="done" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-gray-900 p-4 rounded">
        <h2 className="mb-2 text-sm text-gray-400">
          Completion %
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧠 TASK ANALYSIS */}
      <div className="bg-gray-900 p-4 rounded">
        <h2 className="mb-3 text-sm text-gray-400">
          Task Performance
        </h2>

        {taskData.map((t, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm">
              <span>{t.name}</span>
              <span>{t.percent}%</span>
            </div>

            <div className="bg-gray-700 h-2 rounded mt-1">
              <div
                className="bg-indigo-500 h-2 rounded"
                style={{ width: `${t.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}