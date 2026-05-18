import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

export default function RejectModal({
  doctor,
  failedItems,
  onClose,
  onConfirm,
}) {
  const [customNote, setCustomNote] = useState("");

  const handleSubmit = () => {
    let finalReason = "";

    if (failedItems.length > 0) {
      finalReason += `Failed requirements: [${failedItems.join(", ")}]. `;
    }

    if (customNote.trim()) {
      finalReason += `Admin Note: ${customNote.trim()}`;
    } else if (failedItems.length === 0) {
      finalReason = "Application rejected by admin review.";
    }

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-[12px] border border-[#E5E5E5] w-full max-w-md p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <h3 className="font-bold text-slate-900">Reject Application</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600">
          You are rejecting the verification application for{" "}
          <span className="font-semibold">{doctor?.name}</span>.
        </p>

        {failedItems.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-1.5">
            <p className="text-xs font-semibold text-red-700">
              Detected missing requirements:
            </p>
            <ul className="list-disc pl-4 text-xs text-red-600 space-y-0.5">
              {failedItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Additional Rejection Notes / Instructions
          </label>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Type specific reasons or instructions for the doctor..."
            rows={4}
            className="w-full text-sm px-3 py-2 border border-[#E5E5E5] rounded-lg outline-none focus:border-red-500 resize-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
