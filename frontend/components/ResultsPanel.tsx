import React from "react";
import TableView from "./TableView";

interface PivotRow {
  [key: string]: string | number | null;
}

interface CompareResult {
  current: PivotRow[];
  previous: PivotRow[];
  variation: PivotRow[];
}

interface ResultsPanelProps {
  data: CompareResult;
  dimensions: string[];
  metrics: string[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  data,
  dimensions,
  metrics,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Resultados da Análise
      </h2>

      {/* Tabelas comparativas */}
      <div className="space-y-10">
        {/* Período Atual */}
        <div>
          <h3 className="text-lg font-medium text-green-700 mb-2">
            Período Atual
          </h3>
          {data.current.length > 0 ? (
            <TableView
              data={data.current}
              dimensions={dimensions}
              metrics={metrics}
            />
          ) : (
            <p className="text-gray-500 text-sm">Nenhum dado encontrado.</p>
          )}
          <hr className="my-6 border-gray-200" />
        </div>

        {/* Período Anterior */}
        <div>
          <h3 className="text-lg font-medium text-blue-700 mb-2">
            Período Anterior
          </h3>
          {data.previous.length > 0 ? (
            <TableView
              data={data.previous}
              dimensions={dimensions}
              metrics={metrics}
            />
          ) : (
            <p className="text-gray-500 text-sm">Nenhum dado encontrado.</p>
          )}
          <hr className="my-6 border-gray-200" />
        </div>

        {/* Variação */}
        <div>
          <h3 className="text-lg font-medium text-purple-700 mb-2">
            Variação (%)
          </h3>
          {data.variation.length > 0 ? (
            <TableView
              data={data.variation}
              dimensions={dimensions}
              metrics={metrics}
            />
          ) : (
            <p className="text-gray-500 text-sm">Nenhum dado encontrado.</p>
          )}
          <hr className="my-6 border-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
