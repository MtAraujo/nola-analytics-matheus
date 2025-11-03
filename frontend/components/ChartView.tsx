import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PivotRow {
  [key: string]: string | number | null;
}

interface ChartViewProps {
  data: PivotRow[];
  compareData?: PivotRow[];
  dimensions: string[];
  metrics: string[];
}

const ChartView: React.FC<ChartViewProps> = ({
  data,
  compareData = [],
  dimensions,
  metrics,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
        Nenhum dado para exibir.
      </div>
    );
  }

  // 🔹 Junta dados atuais e anteriores (comparando pela dimensão)
  const mergedData = data.map((curr) => {
    const match = compareData.find(
      (prev) => prev[dimensions[0]] === curr[dimensions[0]]
    );
    const metric = metrics[0];
    const prevValue = match ? Number(match[metric]) : null;
    const currValue = Number(curr[metric]);
    const variation = prevValue
      ? ((currValue - prevValue) / prevValue) * 100
      : null;

    return {
      ...curr,
      [`${metric}_anterior`]: prevValue,
      variation_percent: variation ? variation.toFixed(2) : null,
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comparativo de períodos
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={dimensions[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={metrics[0]}
            name="Período Atual"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey={`${metrics[0]}_anterior`}
            name="Período Anterior"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* 🔹 Indicadores de variação */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {mergedData.map((row, idx) => {
          const variation = Number(row.variation_percent);
          const isPositive = variation > 0;
          return (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
            >
              <div>
                <span className="font-medium text-gray-700">
                  {row[dimensions[0]]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {variation ? (
                  <>
                    {isPositive ? (
                      <ArrowUpRight className="text-green-500 w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="text-red-500 w-5 h-5" />
                    )}
                    <span
                      className={`font-semibold ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {variation > 0 ? "+" : ""}
                      {variation.toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">–</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartView;
