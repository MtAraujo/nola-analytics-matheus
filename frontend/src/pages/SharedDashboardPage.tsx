import React, { useEffect, useState } from "react";
import axios from "axios";
import ResultsPanel from "../../components/ResultsPanel";
import { Toaster, toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

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

interface Filters {
  startDate: string;
  endDate: string;
  channel: string;
  compareStart?: string;
  compareEnd?: string;
}

interface CompareResult {
  current: PivotRow[];
  previous: PivotRow[];
  variation: PivotRow[];
}

type PivotRow = Record<string, string | number | null>;

const SharedDashboardPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [dashboardName, setDashboardName] = useState<string>("");
  const [config, setConfig] = useState<{
    metrics: string[];
    dimensions: string[];
    filters: Filters;
  } | null>(null);
  const [data, setData] = useState<CompareResult>({
    current: [],
    previous: [],
    variation: [],
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Busca o dashboard compartilhado no backend
  useEffect(() => {
    const fetchSharedDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/shares/${token}`);
        const dashboard = res.data;

        setDashboardName(dashboard.name || "Dashboard Compartilhado");
        const parsedConfig =
          typeof dashboard.config === "string"
            ? JSON.parse(dashboard.config)
            : dashboard.config;

        setConfig(parsedConfig);
        toast.success("Dashboard carregado com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar dashboard compartilhado:", error);
        toast.error("Link inválido ou dashboard não encontrado.");
      }
    };

    fetchSharedDashboard();
  }, [token]);

  // 🔹 Roda a análise automaticamente quando o dashboard for carregado
  useEffect(() => {
    if (!config) return;

    const runAnalysis = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3000/metrics/compare", {
          filters: {
            startDate: config.filters.startDate,
            endDate: config.filters.endDate,
            compareStart: config.filters.compareStart,
            compareEnd: config.filters.compareEnd,
            channel: config.filters.channel || null,
          },
          metrics: config.metrics,
          dimensions: config.dimensions,
        });

        const { currentData, previousData, variationData } = res.data;
        setData({
          current: currentData,
          previous: previousData,
          variation: variationData,
        });
      } catch (err) {
        console.error("Erro ao rodar análise compartilhada:", err);
        toast.error("Erro ao carregar os dados deste dashboard.");
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 🔹 Header diferenciado */}
      <header className="sticky top-0 z-10 bg-blue-600 text-white flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <Share2 className="w-6 h-6" />
          <h1 className="text-lg font-semibold">
            {dashboardName || "Dashboard Compartilhado"}
          </h1>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white text-white px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </header>

      {/* 🔹 Resultados */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Carregando análise...</p>
        ) : (
          <ResultsPanel
            data={data}
            dimensions={config?.dimensions || []}
            metrics={config?.metrics || []}
          />
        )}
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default SharedDashboardPage;
