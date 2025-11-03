import React, { useState } from "react";

interface SaveDashboardModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

const SaveDashboardModal: React.FC<SaveDashboardModalProps> = ({
  onSave,
  onClose,
}) => {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Salvar Dashboard
        </h2>

        <input
          type="text"
          placeholder="Nome do dashboard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 w-full p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!name.trim()) return alert("Digite um nome!");
              onSave(name);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveDashboardModal;
