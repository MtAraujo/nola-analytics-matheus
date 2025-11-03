import React from "react";

interface RunButtonProps {
  onRun: () => void;
  loading: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ onRun, loading }) => {
  return (
    <button
      onClick={onRun}
      disabled={loading}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
    >
      {loading ? "Carregando..." : "🚀 Rodar Análise"}
    </button>
  );
};

export default RunButton;
