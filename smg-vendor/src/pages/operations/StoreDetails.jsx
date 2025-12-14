// src/pages/operations/StoreDetails.jsx
import { useEffect, useState } from "react";
import { getStoreBins } from "../../api/operationsApi";


export default function StoreDetails() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreBins()
      .then((data) => setBins(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-5 h-full">
      <h2 className="text-xl font-semibold mb-2">Store / Bin Details</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bins.map((bin) => (
            <div key={bin.id} className="p-4 bg-blue-50 rounded shadow">
              <p className="text-gray-600">{bin.bin_code}</p>
              <p className="font-bold">
                {bin.material_name} – {bin.quantity} {bin.unit}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
