import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-900">
      <h1 className="text-lg font-bold">Tracker</h1>

      <div className="flex gap-4 text-sm">
        <Link to="/">Home</Link>
        <Link to="/charts">Charts</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/add">Add</Link>
      </div>
    </div>
  );
}