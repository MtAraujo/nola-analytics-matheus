import React from "react";
import { Save, Share2, BarChart3, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSave: () => void;
  onShare: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave, onShare }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-3">
      {/* Logo + nome */}
      <div className="flex items-center gap-2">
        <BarChart3 className="text-blue-600 w-6 h-6" />
        <h1 className="text-xl font-semibold text-gray-800">
          God Level Coder Challenge - Matheus Tavares
        </h1>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3">
        {/* Novo botão */}
        <button
          onClick={() => navigate("/dashboards")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          <FolderKanban className="w-4 h-4 text-white" />
          Meus Dashboards
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </button>
      </div>
    </header>
  );
};

export default Header;
