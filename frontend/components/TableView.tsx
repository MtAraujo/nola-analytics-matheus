import React, { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PivotRow {
  [key: string]: string | number | null;
}

interface TableViewProps {
  data: PivotRow[];
  dimensions?: string[];
  metrics?: string[];
}

const TableView: React.FC<TableViewProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">Sem dados disponíveis</p>;
  }

  // 🧮 Paginação
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentData = data.slice(startIdx, endIdx);

  const columns = Object.keys(data[0]);

  const exportCSV = () => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data) {
      csvRows.push(headers.map((h) => row[h]).join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabela.csv";
    a.click();
  };

  // Função exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((h) => row[h]));
    doc.text("Relatório de Dados", 14, 15);
    autoTable(doc, { head: [headers], body: rows, startY: 20 });
    doc.save("tabela.pdf");
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <Download className="w-4 h-4" /> PDF
        </button>
      </div>

      <table className="min-w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-medium text-gray-700 border-b"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr
              key={idx}
              className="border-t hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 text-gray-800 border-b">
                  {(() => {
                    const value = row[col];

                    if (value === null || value === undefined || value === "")
                      return "-";

                    if (typeof value === "number" && Number.isInteger(value))
                      return value;

                    if (typeof value === "number") return value.toFixed(2);

                    if (!isNaN(Number(value))) {
                      const num = Number(value);
                      if (Number.isInteger(num)) return num;
                      return num.toFixed(2);
                    }

                    return value;
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔄 Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
          <p className="text-gray-600 font-medium">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
