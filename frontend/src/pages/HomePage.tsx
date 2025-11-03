import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, PlusCircle, FolderKanban, Github, Linkedin } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Wrapper que força centralização vertical */}
      <div className="flex flex-col flex-grow items-center justify-center text-center px-4">
        {/* Logo / Header */}
        <BarChart3 className="text-blue-600 w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          God Level Analytics
        </h1>
        <p className="text-gray-600 mb-10 text-lg max-w-md">
          Visualize, compare e compartilhe suas métricas com facilidade.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("/builder")}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-6 h-6" />
            Criar Nova Análise
          </button>

          <button
            onClick={() => navigate("/dashboards")}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 border border-blue-300 rounded-xl text-lg font-semibold shadow-sm hover:bg-blue-50 hover:scale-105 transition-transform"
          >
            <FolderKanban className="w-6 h-6" />
            Ver Meus Dashboards
          </button>
        </div>
      </div>

      {/* Rodapé fixo no final da página */}
      <footer className="mt-auto flex flex-col items-center gap-3 py-6 border-t border-gray-200 bg-white text-gray-600">
        <p className="text-sm">
          Desenvolvido por{" "}
          <span className="text-blue-600 font-medium">Matheus Tavares</span> 💻
        </p>

        <div className="flex gap-4">
          <a
            href="https://github.com/MtAraujo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/matheus-araujo-developer/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
