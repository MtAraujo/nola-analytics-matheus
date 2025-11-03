/*import React, { useState } from "react";
import axios from "axios";

export default function PivotBuilder() {
  const [metrics, setMetrics] = useState(["total_sales"]);
  const [dimensions, setDimensions] = useState(["channel"]);
  const [data, setData] = useState([]);

  const runPivot = async () => {
    const res = await axios.post("http://localhost:3000/pivot/run", {
      metrics,
      dimensions,
      filters: { date: { start: "2025-10-01", end: "2025-10-31" } }
    });
    setData(res.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Pivot Table</h2>
      <button onClick={runPivot} className="px-4 py-2 bg-blue-600 text-white rounded">
        Rodar análise
      </button>
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
*/