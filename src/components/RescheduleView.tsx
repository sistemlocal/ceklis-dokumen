import React, { useState } from 'react';
import { 
  CalendarClock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Plane, 
  User, 
  Search, 
  Calendar, 
  AlertCircle,
  FileCheck,
  Check,
  X,
  History,
  Sparkles
} from 'lucide-react';
import { Pilgrim, DocumentChecklist } from '../types/jamaah';
import { AIRLINES_LIST } from '../data/airlineData';

interface RescheduleViewProps {
  pilgrims: Pilgrim[];
  onConfirmReschedule: (pilgrimId: string, newDate: string, newFlightCode?: string, reason?: string) => void;
  onNavigateToHistory: () => void;
  selectedPilgrimId?: string | null;
}

export const RescheduleView: React.FC<RescheduleViewProps> = ({
  pilgrims,
  onConfirmReschedule,
  onNavigateToHistory,
  selectedPilgrimId
}) => {
  // Currently selected pilgrim to reschedule
  const [activePilgrimId, setActivePilgrimId] = useState<string>(
    selectedPilgrimId || (pilgrims.length > 0 ? pilgrims[0].id : '')
  );

  // Search input for choosing pilgrim
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Reschedule form inputs
  const [newDepartureDate, setNewDepartureDate] = useState<string>('');
  const [newAirline, setNewAirline] = useState<string>('');
  const [newFlightCode, setNewFlightCode] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [confirmedSafety, setConfirmedSafety] = useState<boolean>(true);

  // The active selected pilgrim object
  const activePilgrim = pilgrims.find(p => p.id === activePilgrimId) || null;

  // Whenever active pilgrim changes, pre-fill flight info
  React.useEffect(() => {
    if (activePilgrim) {
      setNewAirline(activePilgrim.airline);
      setNewFlightCode(activePilgrim.flightCode);
      setNewDepartureDate('');
      setRescheduleReason('');
    }
  }, [activePilgrimId]);

  // Handle submit reschedule
  const handleProcessReschedule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePilgrim) {
      alert('Silahkan pilih jamaah yang akan dipindahkan tanggal keberangkatannya.');
      return;
    }

    if (!newDepartureDate) {
      alert('Silahkan tentukan tanggal keberangkatan baru.');
      return;
    }

    if (newDepartureDate === activePilgrim.departureDate) {
      alert('Tanggal baru tidak boleh sama dengan tanggal keberangkatan saat ini.');
      return;
    }

    onConfirmReschedule(
      activePilgrim.id,
      newDepartureDate,
      newFlightCode.trim() !== activePilgrim.flightCode ? newFlightCode.trim() : undefined,
      rescheduleReason.trim() || undefined
    );
  };

  const filteredPilgrimsList = pilgrims.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.pilgrimName.toLowerCase().includes(term) ||
      p.airline.toLowerCase().includes(term) ||
      p.flightCode.toLowerCase().includes(term) ||
      (p.passportNumber && p.passportNumber.toLowerCase().includes(term))
    );
  });

  const getDocItems = (p: Pilgrim) => [
    { label: 'Dok. Verif', ok: p.docVerified },
    { label: 'Paspor Asli', ok: p.passport },
    { label: 'Pass Foto', ok: p.photo },
    { label: 'KTP & KK', ok: p.ktpkk },
    { label: 'Meningitis', ok: p.meningitis },
    { label: 'Polio', ok: p.polio },
    { label: 'Biometrik', ok: p.biometric }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Menu Khusus Pindah Tanggal
              </span>
              <span className="text-xs text-blue-300 font-medium">
                Reschedule & Mutasi Berkas Terintegrasi
              </span>
            </div>
            <h3 className="text-xl font-extrabold mt-2 tracking-tight">
              Pemindahan Tanggal Keberangkatan Jamaah
            </h3>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Jika tanggal jamaah dipindahkan, <strong>seluruh file berkas dan status 7 dokumen verifikasi (Paspor, Foto, KTP/KK, Vaksin Meningitis, Polio, dan Biometrik) secara otomatis akan ikut terpindah</strong> ke jadwal baru tanpa ada data yang hilang.
            </p>
          </div>

          <button
            onClick={onNavigateToHistory}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700/80 hover:bg-blue-600 border border-blue-500/50 shadow-md transition flex items-center gap-2 self-start md:self-center shrink-0"
          >
            <History className="w-4 h-4 text-blue-200" />
            Lihat Riwayat Mutasi →
          </button>
        </div>
      </div>

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Pindah Tanggal (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <form onSubmit={handleProcessReschedule} className="space-y-6">
            {/* Step 1: Selector Jamaah */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Langkah 1: Pilih Jamaah yang Akan Dipindahkan
                </label>
                <span className="text-[11px] text-slate-500">
                  {pilgrims.length} Jamaah Terdaftar
                </span>
              </div>

              <select
                value={activePilgrimId}
                onChange={(e) => setActivePilgrimId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
              >
                {pilgrims.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.pilgrimName} — {p.airline} ({p.flightCode}) — Tgl: {p.departureDate} {p.isRescheduled ? '(Pernah Reschedule)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Pilgrim Current Status Card */}
            {activePilgrim && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Jadwal Keberangkatan Saat Ini:</span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ID: {activePilgrim.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Maskapai & Flight</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Plane className="w-3.5 h-3.5 text-emerald-600" />
                      {activePilgrim.airline} ({activePilgrim.flightCode})
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Tanggal Terbang Asal</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {activePilgrim.departureDate}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">No. Paspor</span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      {activePilgrim.passportNumber || 'Belum diisi'}
                    </span>
                  </div>
                </div>

                {/* Status 7 Dokumen yang Otomatis Ikut Terpindah */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Status 7 Dokumen (Akan Otomatis Terpindah Utuh):
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Auto-Transfer 100%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    {getDocItems(activePilgrim).map((doc, idx) => (
                      <div 
                        key={idx}
                        className={`px-2 py-1.5 rounded-lg border flex items-center justify-between ${
                          doc.ok 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                      >
                        <span className="font-medium truncate pr-1">{doc.label}</span>
                        {doc.ok ? (
                          <Check className="w-3.5 h-3.5 shrink-0 stroke-[3] text-emerald-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 shrink-0 stroke-[2.5] text-rose-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: New Date & Flight Specification */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                Langkah 2: Tentukan Tanggal & Penerbangan Baru
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tanggal Baru */}
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1.5">
                    Pindah Tanggal Ke (Tanggal Baru) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDepartureDate}
                    onChange={(e) => setNewDepartureDate(e.target.value)}
                    className="w-full bg-blue-50/60 border border-blue-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600"
                  />
                  <span className="text-[11px] text-blue-700 mt-1 block">
                    Pilih tanggal jadwal keberangkatan yang baru
                  </span>
                </div>

                {/* Kode Penerbangan Baru (Opsional ganti) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kode Penerbangan Baru (Flight Code)
                  </label>
                  <input
                    type="text"
                    value={newFlightCode}
                    onChange={(e) => setNewFlightCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: SV 819 / GA 980"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm uppercase tracking-wider font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Kosongkan bila nomor penerbangan tetap sama
                  </span>
                </div>
              </div>

              {/* Alasan Pemindahan Tanggal */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alasan Pemindahan Tanggal / Catatan Mutasi
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Contoh: Penyesuaian cuti dinas kantor / Masalah kesehatan / Permintaan keluarga"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Akan tercatat otomatis pada buku audit trail Riwayat Mutasi Jadwal
                </span>
              </div>
            </div>

            {/* Live Reschedule Migration Preview */}
            {activePilgrim && newDepartureDate && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pratinjau Hasil Perpindahan Jadwal & Berkas:
                </span>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">DARI JADWAL LAMA:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {activePilgrim.departureDate} ({activePilgrim.flightCode})
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-600 block font-semibold">KE JADWAL BARU:</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {newDepartureDate} ({newFlightCode || activePilgrim.flightCode})
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  ✓ Seluruh status kelengkapan 7 dokumen ({activePilgrim.docVerified ? 'Terverifikasi Penuh' : 'Sesuai Status Terkini'}) otomatis disinkronkan ke tanggal baru.
                </p>
              </div>
            )}

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedSafety}
                onChange={(e) => setConfirmedSafety(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5"
              />
              <span className="text-xs text-slate-600 leading-tight">
                Saya mengonfirmasi perpindahan tanggal keberangkatan jamaah ini dan memastikan berkas otomatis terbawa ke manifest penerbangan baru.
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={!confirmedSafety || !newDepartureDate}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <CalendarClock className="w-4 h-4" />
                Proses Pindah Tanggal & Sinkronkan Dokumen
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Daftar Cepat Jamaah Untuk Dipindahkan (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Pilih Dari Daftar Jamaah
              </h4>
              <p className="text-xs text-slate-500">
                Klik jamaah untuk memilih dan memindahkan jadwalnya
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama jamaah atau flight..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] pr-1">
            {filteredPilgrimsList.map(p => {
              const isSelected = p.id === activePilgrimId;
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePilgrimId(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      {p.pilgrimName}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                        Dipilih
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Plane className="w-3 h-3 text-emerald-600" />
                      {p.airline} ({p.flightCode})
                    </span>
                    <span className="font-mono text-blue-700 font-semibold">
                      {p.departureDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 text-[10px]">
                    <span className={p.docVerified ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {p.docVerified ? '✓ 7 Dokumen Terverifikasi' : 'Dokumen Pending'}
                    </span>
                    {p.isRescheduled && (
                      <span className="text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                        Pernah Pindah
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
