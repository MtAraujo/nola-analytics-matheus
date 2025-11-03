import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Home, Trash2, Eye, Share2, Link2, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

interface DashboardConfig {
  metrics: string[];
  dimensions: string[];
  filters: {
    startDate?: string;
    endDate?: string;
    channel?: string;
    compareStart?: string;
    compareEnd?: string;
  };
}

interface Dashboard {
  id: number;
  name: string;
  config: DashboardConfig;
  created_at: string;
}

const DashboardListPage: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [shareLinks, setShareLinks] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Dashboard[]>("http://localhost:3000/dashboards")
      .then((res) => setDashboards(res.data))
      .catch((err) => console.error("Erro ao buscar dashboards:", err));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este dashboard?")) return;

    try {
      await axios.delete(`http://localhost:3000/dashboards/${id}`);
      setDashboards((prev) => prev.filter((d) => d.id !== id));
      toast.success("Dashboard excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir dashboard:", err);
      toast.error("Falha ao excluir o dashboard.");
    }
  };

  const handleShare = async (dashboardId: number) => {
    try {
      const response = await axios.post("http://localhost:3000/shares", {
        dashboard_id: dashboardId,
      });
      const token = response.data.token;
      const link = `http://localhost:5173/shares/${token}`;
      setShareLinks((prev) => ({ ...prev, [dashboardId]: link }));
      toast.success("Link de compartilhamento gerado!");
    } catch (error) {
      console.error("Erro ao gerar link de compartilhamento:", error);
      toast.error("Falha ao gerar link de compartilhamento.");
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Meus Dashboards
        </h1>

        {/* Botão para retornar */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Home className="w-4 h-4" />
          Voltar para Home
        </button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboards.length > 0 ? (
          dashboards.map((d) => (
            <div
              key={d.id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {d.name}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Criado em:{" "}
                {new Date(d.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>

              {/* 🔗 Exibe o link se já foi gerado */}
              {shareLinks[d.id] && (
                <div className="bg-gray-100 border border-gray-200 rounded-md p-2 mb-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <Link2 className="w-4 h-4 text-gray-500" />
                    <a
                      href={shareLinks[d.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-[220px]"
                    >
                      {shareLinks[d.id]}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopyLink(shareLinks[d.id])}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    navigate("/builder", { state: { dashboard: d } })
                  }
                  className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition"
                >
                  <Eye className="w-4 h-4" /> Abrir
                </button>

                <button
                  onClick={() => handleShare(d.id)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition"
                >
                  <Share2 className="w-4 h-4" /> Compartilhar
                </button>

                <button
                  onClick={() => handleDelete(d.id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center mt-10">
            Nenhum dashboard salvo ainda.
          </p>
        )}
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default DashboardListPage;
