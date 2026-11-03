import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Pilgrim } from '../types/jamaah';

interface ConfirmDeleteModalProps {
  pilgrim: Pilgrim | null;
  onClose: () => void;
  onConfirm: (pilgrimId: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  pilgrim,
  onClose,
  onConfirm
}) => {
  if (!pilgrim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">
            Konfirmasi Hapus Jamaah
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Apakah Anda yakin ingin menghapus data jamaah <strong className="text-slate-800">{pilgrim.pilgrimName}</strong> ({pilgrim.airline} - {pilgrim.flightCode})? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition"
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(pilgrim.id)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Ya, Hapus Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
