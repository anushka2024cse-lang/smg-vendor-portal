// src/pages/operations/ProductionSchedule.jsx
import { useEffect, useState } from "react";
import { getProductionSchedule } from "../../api/operationsApi";


export default function ProductionSchedule() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductionSchedule()
      .then((data) => setRows(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-5 h-full">
      <h2 className="text-xl font-semibold mb-2">Production Schedule</h2>
      <p className="text-gray-500 mb-3">Your scheduled production tasks.</p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Shift</th>
              <th className="p-2 border">Task</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="p-2 border">
                  {new Date(row.schedule_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="p-2 border">{row.shift}</td>
                <td className="p-2 border">{row.task}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
