import React from "react";
import { Layers } from "lucide-react";

interface Dimension {
  id: string;
  label: string;
  sql: string;
}

interface DimensionSelectorProps {
  dimensions: Dimension[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const DimensionSelector: React.FC<DimensionSelectorProps> = ({
  dimensions,
  selected,
  onChange,
}) => {
  const toggleDimension = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((d) => d !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Dimensões</h3>
      </div>

      <ul className="flex flex-col gap-2">
        {dimensions.map((d) => (
          <li key={d.id}>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-purple-600 transition">
              <input
                type="checkbox"
                checked={selected.includes(d.id)}
                onChange={() => toggleDimension(d.id)}
                className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
              />
              {d.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DimensionSelector;
