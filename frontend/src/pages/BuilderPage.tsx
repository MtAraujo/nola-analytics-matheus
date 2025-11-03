import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import MetricSelector from "../../components/MetricSelector";
import DimensionSelector from "../../components/DimensionSelector";
import FilterPanel from "../../components/FilterPanel";
import RunButton from "../../components/RunButton";
import ResultsPanel from "../../components/ResultsPanel";
import { Toaster, toast } from "sonner";
import SaveDashboardModal from "../../components/SaveDashboardModal";
import ShareDashboardModal from "../../components/ShareDashboardModal";
import { useLocation } from "react-router-dom";

interface Metric {
  id: string;
  label: string;
  sql: string;
}

interface Dimension {
  id: string;
  label: string;
  sql: string;
}

interface Catalog {
  metrics: Metric[];
  dimensions: Dimension[];
}

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

const BuilderPage: React.FC = () => {
  const [catalog, setCatalog] = useState<Catalog>({
    metrics: [],
    dimensions: [],
  });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    channel: "",
  });
  const [data, setData] = useState<CompareResult>({
    current: [],
    previous: [],
    variation: [],
  });
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sharedDashboardId, setSharedDashboardId] = useState<string | null>(
    null
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastSavedDashboardId, setLastSavedDashboardId] = useState<
    number | null
  >(null);

  const location = useLocation();
  const dashboard = location.state?.dashboard;

  // 🔹 Carrega catálogo de métricas e dimensões
  useEffect(() => {
    axios
      .get<Catalog>("http://localhost:3000/metrics/catalog")
      .then((res) => setCatalog(res.data))
      .catch((err) => console.error("Erro ao buscar catálogo:", err));
  }, []);

  useEffect(() => {
    if (dashboard) {
      try {
        const parsedConfig =
          typeof dashboard.config === "string"
            ? JSON.parse(dashboard.config)
            : dashboard.config;

        setSelectedMetrics(parsedConfig.metrics || []);
        setSelectedDimensions(parsedConfig.dimensions || []);
        setFilters((prev) => parsedConfig.filters || prev);

        toast.success(`Dashboard "${dashboard.name}" carregado com sucesso!`);
      } catch (error) {
        console.error("Erro ao carregar dashboard salvo:", error);
        toast.error("Falha ao carregar dashboard salvo.");
      }
    }
  }, [dashboard]);

  // Executa automaticamente a análise quando tudo estiver carregado
  useEffect(() => {
    if (
      dashboard &&
      selectedMetrics.length > 0 &&
      selectedDimensions.length > 0
    ) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetrics, selectedDimensions]);

  // 🔹 Executa análise
  const runAnalysis = async () => {
    if (selectedMetrics.length === 0 || selectedDimensions.length === 0) {
      alert(
        "Selecione ao menos uma métrica e uma dimensão antes de rodar a análise."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/metrics/compare", {
        filters: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          compareStart: filters.compareStart,
          compareEnd: filters.compareEnd,
          channel: filters.channel || null,
        },
        metrics: selectedMetrics,
        dimensions: selectedDimensions,
      });

      const { currentData, previousData, variationData } = res.data;

      setData({
        current: currentData,
        previous: previousData,
        variation: variationData,
      });
    } catch (err) {
      console.error("Erro ao rodar análise:", err);
      alert("Erro ao buscar dados. Verifique o backend.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Salvar dashboard
  const handleSaveDashboard = async (name: string) => {
    try {
      const res = await axios.post("http://localhost:3000/dashboards", {
        name,
        config: {
          metrics: selectedMetrics,
          dimensions: selectedDimensions,
          filters,
        },
      });
      setLastSavedDashboardId(res.data.id);
      toast.success(`Dashboard "${name}" salvo com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar dashboard:", error);
      toast.error("Falha ao salvar dashboard.");
    }
  };

  // 🔹 Compartilhar dashboard
  const handleShareDashboard = async () => {
    if (!lastSavedDashboardId) {
      toast.error("Salve o dashboard antes de compartilhar.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/shares", {
        dashboard_id: lastSavedDashboardId,
      });

      const id = response.data.token;
      setSharedDashboardId(id);
      setShowShareModal(true);
      toast.success("Link de compartilhamento gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar link de compartilhamento:", error);
      toast.error("Falha ao gerar link de compartilhamento.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header
        onSave={() => setShowSaveModal(true)}
        onShare={handleShareDashboard}
      />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Painel de seleção */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <MetricSelector
              metrics={catalog.metrics}
              selected={selectedMetrics}
              onChange={setSelectedMetrics}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <DimensionSelector
              dimensions={catalog.dimensions}
              selected={selectedDimensions}
              onChange={setSelectedDimensions}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Botão rodar */}
        <div className="flex justify-center">
          <RunButton onRun={runAnalysis} loading={loading} />
        </div>

        {/* Resultados */}
        <ResultsPanel
          data={data}
          dimensions={selectedDimensions}
          metrics={selectedMetrics}
        />
      </div>

      {/* Modais */}
      {showSaveModal && (
        <SaveDashboardModal
          onSave={handleSaveDashboard}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {sharedDashboardId && showShareModal && (
        <ShareDashboardModal
          dashboardId={sharedDashboardId}
          onClose={() => setShowShareModal(false)}
        />
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default BuilderPage;
