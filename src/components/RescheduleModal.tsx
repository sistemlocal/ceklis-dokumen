import React, { useState } from 'react';
import { 
  CalendarClock, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Plane,
  AlertTriangle
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';

interface RescheduleModalProps {
  pilgrim: Pilgrim | null;
  onClose: () => void;
  onConfirm: (pilgrimId: string, newDate: string, newFlightCode?: string, reason?: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  pilgrim,
  onClose,
  onConfirm
}) => {
  if (!pilgrim) return null;

  const [newDate, setNewDate] = useState<string>('');
  const [newFlightCode, setNewFlightCode] = useState<string>(pilgrim.flightCode);
  const [reason, setReason] = useState<string>('');
  const [confirmedCheck, setConfirmedCheck] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      alert('Silahkan pilih tanggal keberangkatan yang baru.');
      return;
    }
    if (newDate === pilgrim.departureDate) {
      alert('Tanggal baru tidak boleh sama persis dengan tanggal sebelumnya.');
      return;
    }

    onConfirm(
      pilgrim.id,
      newDate,
      newFlightCode.trim() !== pilgrim.flightCode ? newFlightCode.trim() : undefined,
      reason.trim() || undefined
    );
  };

  const docs = [
    { name: 'Paspor Asli', ok: pilgrim.passport },
    { name: 'Pass Foto 4x6', ok: pilgrim.photo },
    { name: 'KTP & KK', ok: pilgrim.ktpkk },
    { name: 'Vaksin Meningitis', ok: pilgrim.meningitis },
    { name: 'Vaksin Polio', ok: pilgrim.polio },
    { name: 'Biometrik (Bio Visa)', ok: pilgrim.biometric },
    { name: 'Dokumen Terverifikasi', ok: pilgrim.docVerified }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <CalendarClock className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Pindah Tanggal Keberangkatan
              </h3>
              <p className="text-xs text-blue-200">
                Reschedule Jadwal Jamaah & Sinkronisasi Dokumen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Pilgrim Info Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-bold text-sm text-slate-800">{pilgrim.pilgrimName}</div>
            <div className="flex items-center gap-3 mt-1 text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Plane className="w-3.5 h-3.5 text-emerald-600" />
                {pilgrim.airline} ({pilgrim.flightCode})
              </span>
              <span className="text-slate-400">•</span>
              <span>Tgl Asli: <strong className="text-slate-800">{pilgrim.departureDate}</strong></span>
            </div>
          </div>

          {/* Automatic Document Preservation Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-emerald-950 block">
                  Garansi Sistem Auto-Transfer Dokumen:
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Semua file dan status verifikasi 7 dokumen jamaah berikut akan <strong>secara otomatis ikut terpindah</strong> ke jadwal baru tanpa ada data yang hilang:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {docs.map((d, i) => (
                    <span 
                      key={i} 
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 ${
                        d.ok 
                          ? 'bg-emerald-200/70 text-emerald-900 border border-emerald-300' 
                          : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      {d.ok ? '✓' : '✗'} {d.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* New Date Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pindah Tanggal Ke (Tanggal Baru) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-slate-100 rounded-xl font-mono text-slate-500 text-xs shrink-0">
                {pilgrim.departureDate}
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-300 rounded-xl px-3 py-2 text-xs font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* New Flight Code (optional adjustment) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kode Penerbangan Baru (Jika ganti flight)
            </label>
            <input
              type="text"
              value={newFlightCode}
              onChange={(e) => setNewFlightCode(e.target.value.toUpperCase())}
              placeholder={pilgrim.flightCode}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono font-bold"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alasan Pemindahan Tanggal
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Menyesuaikan cuti keluarga / Sakit / Perubahan jadwal kloter"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedCheck}
              onChange={(e) => setConfirmedCheck(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5"
            />
            <span className="text-[11px] text-slate-600 leading-tight">
              Saya mengonfirmasi pemindahan jadwal jamaah ini dan setuju seluruh dokumen otomatis diteruskan ke manifest jadwal baru.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!confirmedCheck || !newDate}
              className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Proses Pindah Tanggal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
