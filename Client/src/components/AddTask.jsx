import { useState } from "react";
import { motion } from "framer-motion";
import { addTask } from "../api";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("boolean");
  const [goal, setGoal] = useState("");
  const [repeat, setRepeat] = useState("daily");
  const [date, setDate] = useState("");

  const submit = async () => {
    if (!title) return alert("Enter task name");

    await addTask({
      title,
      type,
      goal: type === "numeric" ? Number(goal) : null,
      repeat,
      date: repeat === "once" ? date : null
    });

    setTitle("");
    setGoal("");
    setDate("");
    alert("Task Added 🚀");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-4 text-white"
    >
      <h1 className="text-2xl font-bold mb-6">Add New Task</h1>

      <div className="bg-gray-900 p-5 rounded-2xl space-y-4 shadow-lg">

        {/* Task Name */}
        <div>
          <label className="text-sm text-gray-400">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Study, Gym..."
            className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white outline-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-sm text-gray-400">
            Task Type
          </label>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setType("boolean")}
              className={`flex-1 py-2 rounded-xl ${
                type === "boolean"
                  ? "bg-indigo-500"
                  : "bg-gray-800"
              }`}
            >
              Simple
            </button>

            <button
              onClick={() => setType("numeric")}
              className={`flex-1 py-2 rounded-xl ${
                type === "numeric"
                  ? "bg-indigo-500"
                  : "bg-gray-800"
              }`}
            >
              Goal
            </button>
          </div>
        </div>

        {/* Goal Input */}
        {type === "numeric" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="text-sm text-gray-400">
              Goal Value
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. 120 (grams, mins...)"
              className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white"
            />
          </motion.div>
        )}

        {/* Repeat */}
        <div>
          <label className="text-sm text-gray-400">
            Repeat
          </label>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setRepeat("daily")}
              className={`flex-1 py-2 rounded-xl ${
                repeat === "daily"
                  ? "bg-green-500"
                  : "bg-gray-800"
              }`}
            >
              Daily
            </button>

            <button
              onClick={() => setRepeat("once")}
              className={`flex-1 py-2 rounded-xl ${
                repeat === "once"
                  ? "bg-yellow-500"
                  : "bg-gray-800"
              }`}
            >
              One-time
            </button>
          </div>
        </div>

        {/* Date Picker */}
        {repeat === "once" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="text-sm text-gray-400">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white"
            />
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={submit}
          className="w-full py-3 rounded-xl bg-indigo-500 font-semibold"
        >
          Add Task
        </motion.button>
      </div>
    </motion.div>
  );
}