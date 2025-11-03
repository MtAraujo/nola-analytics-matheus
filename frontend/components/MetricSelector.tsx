import React from "react";
import { BarChart3 } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  sql: string;
}

interface MetricSelectorProps {
  metrics: Metric[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({
  metrics,
  selected,
  onChange,
}) => {
  const toggleMetric = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((m) => m !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Métricas</h3>
      </div>

      <ul className="flex flex-col gap-2">
        {metrics.map((m) => (
          <li key={m.id}>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition">
              <input
                type="checkbox"
                checked={selected.includes(m.id)}
                onChange={() => toggleMetric(m.id)}
                className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
              />
              {m.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetricSelector;
