import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Calendar() {
  const [days, setDays] = useState([]);
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/month/${year}/${month + 1}`
    );

    const logs = res.data;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const log = logs.find((d) => d.date === date);

      let percent = 0;

      if (log) {
        const total = log.tasks.length;
        const done = log.tasks.filter((t) =>
          t.type === "boolean"
            ? t.completed
            : t.value >= t.goal
        ).length;

        percent = total ? Math.round((done / total) * 100) : 0;
      }

      calendar.push({
        date,
        percent,
        tasks: log?.tasks || null
      });
    }

    setDays(calendar);
  };

  const getColor = (p) => {
    if (!p) return "bg-gray-700";
    if (p > 80) return "bg-green-500";
    if (p > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl mb-4">Monthly Calendar</h1>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelected(d)}
            className={`p-3 rounded cursor-pointer text-center ${getColor(
              d.percent
            )}`}
          >
            <div>{d.date.slice(-2)}</div>
          </motion.div>
        ))}
      </div>

      {/* POPUP */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gray-900 p-5 rounded w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-lg">
              {selected.date}
            </h2>

            {!selected.tasks ? (
              <p className="text-gray-400">
                No data for this day
              </p>
            ) : (
              selected.tasks.map((t, i) => (
                <div key={i} className="mb-2">
                  <span>{t.title}</span>{" "}
                  {t.type === "boolean"
                    ? t.completed
                      ? "✅"
                      : "❌"
                    : `${t.value}/${t.goal}`}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}