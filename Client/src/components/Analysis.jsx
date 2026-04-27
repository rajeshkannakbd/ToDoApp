import { useEffect, useState } from "react";
import { getWeek } from "../api";

export default function Analysis() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getWeek();
    setData(res.data);
  };

  return (
    <div className="p-4 text-white">
      <h1>Last 7 Days</h1>

      {data.map((d, i) => (
        <div key={i} className="mb-2 bg-gray-800 p-2">
          {d.date} - {d.tasks.filter(t => t.completed).length} done
        </div>
      ))}
    </div>
  );
}