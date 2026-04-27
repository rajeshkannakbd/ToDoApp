import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([
    { text: "Ask me about your progress 📊", type: "bot" }
  ]);

  const send = async (text) => {
    const newMessages = [...messages, { text, type: "user" }];
    setMessages(newMessages);

    // simple logic
    let reply = "I didn't understand.";

    if (text.toLowerCase().includes("week")) {
      const res = await axios.get(
        "http://localhost:5000/api/insights"
      );

      reply = `${res.data.message} (${res.data.percent}%)`;
    }

    setMessages([
      ...newMessages,
      { text: reply, type: "bot" }
    ]);
  };

  return (
    <div className="p-4 text-white flex flex-col h-[80vh]">
      <h1 className="text-xl mb-4">💬 Insights Chat</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded max-w-[70%] ${
              m.type === "user"
                ? "bg-indigo-500 ml-auto"
                : "bg-gray-700"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.target.msg.value;
          if (!text) return;
          send(text);
          e.target.reset();
        }}
        className="mt-3 flex"
      >
        <input
          name="msg"
          placeholder="Ask something..."
          className="flex-1 p-2 text-black rounded-l"
        />
        <button className="bg-indigo-500 px-4 rounded-r">
          Send
        </button>
      </form>
    </div>
  );
}