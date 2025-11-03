import React from "react";
import { Filter } from "lucide-react";

export interface Filters {
  startDate: string;
  endDate: string;
  compareStart?: string;
  compareEnd?: string;
  channel: string;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (updatedFilters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
      </div>

      {/* Filtro principal */}
      <div className="flex flex-col gap-3 text-sm mb-4">
        <div className="flex flex-col">
          <label className="text-gray-600">Data inicial:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              onChange({ ...filters, startDate: e.target.value })
            }
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600">Data final:</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600">Canal:</label>
          <select
            value={filters.channel}
            onChange={(e) => onChange({ ...filters, channel: e.target.value })}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
          >
            <option value="">Todos</option>
            <option value="iFood">iFood</option>
            <option value="Presencial">Presencial</option>
            <option value="App Próprio">App Próprio</option>
          </select>
        </div>
      </div>

      {/* Período de comparação */}
      <div className="border-t border-gray-200 pt-4 mt-2">
        <h4 className="text-gray-800 font-medium mb-2">Comparar com:</h4>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-600">Data inicial (comparar):</label>
            <input
              type="date"
              value={filters.compareStart || ""}
              onChange={(e) =>
                onChange({ ...filters, compareStart: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Data final (comparar):</label>
            <input
              type="date"
              value={filters.compareEnd || ""}
              onChange={(e) =>
                onChange({ ...filters, compareEnd: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
