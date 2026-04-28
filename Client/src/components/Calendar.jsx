import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Calendar() {
  const [days, setDays] = useState([]);
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get(
      `https://todoappserver-tggh.onrender.com/api/month/${year}/${month + 1}`
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
    <div className="p-3 text-white max-w-md mx-auto">
      <h1 className="text-lg mb-3 text-center">
        Monthly Calendar
      </h1>

      {/* WEEK LABELS */}
      <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(d)}
            className={`aspect-square flex items-center justify-center rounded text-xs cursor-pointer ${getColor(
              d.percent
            )}`}
          >
            {d.date.slice(-2)}
          </motion.div>
        ))}
      </div>

      {/* MOBILE POPUP */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-gray-900 w-full sm:w-80 p-4 rounded-t-2xl sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-center">
              {selected.date}
            </h2>

            {!selected.tasks ? (
              <p className="text-gray-400 text-center">
                No data for this day
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selected.tasks.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <span>{t.title}</span>
                    <span>
                      {t.type === "boolean"
                        ? t.completed
                          ? "✅"
                          : "❌"
                        : `${t.value}/${t.goal}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}