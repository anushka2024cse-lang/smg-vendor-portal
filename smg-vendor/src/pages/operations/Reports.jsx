// src/pages/operations/Reports.jsx

export default function Reports() {
  const handleGenerateReport = () => {
    alert("Report generation is not implemented yet. This will call /api/operations/report in the future.");
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 h-full transition hover:shadow-md">
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      <button
        onClick={handleGenerateReport}
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Report
      </button>
    </div>
  );
}
