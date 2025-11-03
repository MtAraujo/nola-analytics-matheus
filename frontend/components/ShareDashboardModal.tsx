import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareDashboardModalProps {
  dashboardId: string;
  onClose: () => void;
}

const ShareDashboardModal: React.FC<ShareDashboardModalProps> = ({
  dashboardId,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/shares/${dashboardId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="text-green-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-800">
            Compartilhar Dashboard
          </h2>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Gere um link público para compartilhar este dashboard com sua equipe.
        </p>

        <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mb-4 font-mono text-sm text-gray-700 break-all">
          {shareLink}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white hover:bg-gray-100 transition"
          >
            Fechar
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition active:scale-95"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copiado!" : "Copiar link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDashboardModal;
