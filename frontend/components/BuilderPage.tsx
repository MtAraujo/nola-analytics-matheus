// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "./Header";
// import MetricSelector from "./MetricSelector";
// import DimensionSelector from "./DimensionSelector";
// import FilterPanel from "./FilterPanel";
// import RunButton from "./RunButton";
// import ResultsPanel from "./ResultsPanel";

// interface Metric {
//   id: string;
//   label: string;
//   sql: string;
// }

// interface Dimension {
//   id: string;
//   label: string;
//   sql: string;
// }

// interface Catalog {
//   metrics: Metric[];
//   dimensions: Dimension[];
// }

// interface Filters {
//   startDate: string;
//   endDate: string;
//   channel: string;
// }

// type PivotRow = Record<string, string | number | null>;

// const BuilderPage: React.FC = () => {
//   const [catalog, setCatalog] = useState<Catalog>({ metrics: [], dimensions: [] });
//   const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
//   const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
//   const [filters, setFilters] = useState<Filters>({
//     startDate: "2025-06-01",
//     endDate: "2025-08-31",
//     channel: "",
//   });
//   const [data, setData] = useState<PivotRow[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios
//       .get<Catalog>("http://localhost:3000/metrics/catalog")
//       .then((res) => {
//         setCatalog(res.data);
//       })
//       .catch((err) => console.error("Erro ao buscar catálogo:", err));
//   }, []);


//   const runAnalysis = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post<PivotRow[]>("http://localhost:3000/pivot/run", {
//         metrics: selectedMetrics,
//         dimensions: selectedDimensions,
//         filters: {
//           date: { start: filters.startDate, end: filters.endDate },
//           channel: filters.channel || undefined,
//         },
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error("Erro ao rodar análise:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         onSave={() => alert("Salvar dashboard ainda não implementado")}
//         onShare={() => alert("Compartilhar ainda não implementado")}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//         <MetricSelector
//           metrics={catalog.metrics}
//           selected={selectedMetrics}
//           onChange={setSelectedMetrics}
//         />

//         <DimensionSelector
//           dimensions={catalog.dimensions}
//           selected={selectedDimensions}
//           onChange={setSelectedDimensions}
//         />

//         <FilterPanel filters={filters} onChange={setFilters} />
//       </div>

//       <div className="flex justify-center">
//         <RunButton onRun={runAnalysis} loading={loading} />
//       </div>

//       <ResultsPanel
//         data={data}
//         dimensions={selectedDimensions}
//         metrics={selectedMetrics}
//       />
//     </div>
//   );
// };

// export default BuilderPage;
