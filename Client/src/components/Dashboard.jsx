import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { getToday, saveDay } from "../api";

const today = new Date().toISOString().split("T")[0];

export default function Dashboard() {
  const [data, setData] = useState({ date: today, tasks: [] });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getToday(today);

    // ✅ FIX: sort by order
    const sorted = (res.data.tasks || []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    setData({
      ...res.data,
      tasks: sorted
    });
  };

  const update = async (tasks) => {
    setData({ ...data, tasks });

    console.log("SENDING:", tasks); // debug

    await saveDay({
      date: data.date,
      tasks: tasks
    });
  };

  const toggle = (i) => {
    const tasks = [...data.tasks];
    tasks[i].completed = !tasks[i].completed;
    update(tasks);
  };

  const updateValue = (i, val) => {
    const tasks = [...data.tasks];
    tasks[i].value = Number(val);
    update(tasks);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-white space-y-4">
      <h1 className="text-xl">Today</h1>

      <p className="text-xs text-gray-400">
        Drag to reorder tasks
      </p>

      {/* ✅ DRAG SYSTEM */}
      <Reorder.Group
        axis="y"
        values={data.tasks}
        onReorder={(newOrder) => {
          const updated = newOrder.map((t, index) => ({
            ...t, // ✅ keep taskId
            order: index
          }));

          update(updated);
        }}
        className="space-y-3"
      >
        {data.tasks.map((t, i) => (
          <Reorder.Item
            key={t.taskId} // ✅ CRITICAL
            value={t}
            whileDrag={{ scale: 1.05 }}
            className="bg-gray-800 p-4 rounded-2xl shadow cursor-grab active:cursor-grabbing"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2>{t.title}</h2>
                <p className="text-xs">🔥 {t.streak}</p>
              </div>

              {t.type === "boolean" ? (
                <button
                  onClick={() => toggle(i)}
                  className={`w-12 h-6 rounded-full ${
                    t.completed
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                />
              ) : null}
            </div>

            {t.type === "numeric" && (
              <input
                type="number"
                value={t.value}
                onChange={(e) =>
                  updateValue(i, e.target.value)
                }
                className="w-full mt-2 p-2 text-black"
              />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}