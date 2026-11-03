import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  Edit3, 
  Trash2, 
  CalendarClock, 
  Check, 
  X, 
  Plane, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Pilgrim, DocumentChecklist } from '../types/jamaah';
import { AIRLINES_LIST } from '../data/airlineData';

interface JamaahTableProps {
  pilgrims: Pilgrim[];
  onEdit: (pilgrim: Pilgrim) => void;
  onDeleteRequest: (pilgrim: Pilgrim) => void;
  onQuickReschedule: (pilgrim: Pilgrim) => void;
  onToggleDocStatus: (pilgrimId: string, docKey: keyof DocumentChecklist) => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  initialFilterStatus?: string;
}

export const JamaahTable: React.FC<JamaahTableProps> = ({
  pilgrims,
  onEdit,
  onDeleteRequest,
  onQuickReschedule,
  onToggleDocStatus,
  onExportExcel,
  onExportPDF,
  initialFilterStatus = 'all'
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [statusFilter, setStatusFilter] = useState(initialFilterStatus);
  const [sortBy, setSortBy] = useState<'departureDate' | 'pilgrimName' | 'createdAt'>('departureDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered & Sorted list
  const filteredPilgrims = useMemo(() => {
    return pilgrims.filter(p => {
      // Search matches name, flightCode, airline, passportNumber, city
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        p.pilgrimName.toLowerCase().includes(term) ||
        p.flightCode.toLowerCase().includes(term) ||
        p.airline.toLowerCase().includes(term) ||
        (p.passportNumber && p.passportNumber.toLowerCase().includes(term)) ||
        (p.city && p.city.toLowerCase().includes(term));

      if (!matchSearch) return false;

      // Airline filter
      if (selectedAirline !== 'all' && p.airline !== selectedAirline) {
        return false;
      }

      // Status filter
      if (statusFilter === 'verified' && !p.docVerified) return false;
      if (statusFilter === 'pending' && p.docVerified) return false;
      if (statusFilter === 'rescheduled' && !p.isRescheduled) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [pilgrims, searchTerm, selectedAirline, statusFilter, sortBy, sortOrder]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const renderDocBadge = (
    isOk: boolean, 
    pilgrimId: string, 
    docKey: keyof DocumentChecklist, 
    title: string
  ) => {
    return (
      <button
        onClick={() => onToggleDocStatus(pilgrimId, docKey)}
        title={`Klik untuk ubah status ${title} (${isOk ? 'Terverifikasi' : 'Belum Lengkap'})`}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-90 mx-auto ${
          isOk
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-xs border border-emerald-300'
            : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-200'
        }`}
      >
        {isOk ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : (
          <X className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Header & Actions */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                Data Jamaah & Status Verifikasi Berkas
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {filteredPilgrims.length} dari {pilgrims.length} Jamaah
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada simbol ceklis dokumen untuk mengubah status secara realtime.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 shadow-xs transition flex items-center gap-1.5 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Download Excel
            </button>
            <button
              onClick={onExportPDF}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-800 bg-white hover:bg-rose-50 border border-rose-300 shadow-xs transition flex items-center gap-1.5 active:scale-95"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200/60">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama jamaah, flight, paspor..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
            />
          </div>

          {/* Maskapai Filter */}
          <div>
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-700"
            >
              <option value="all">Semua Maskapai</option>
              <option value="Saudia Airlines">Saudia Airlines (SV)</option>
              {AIRLINES_LIST.filter(a => a.name !== 'Saudia Airlines').map(a => (
                <option key={a.code} value={a.name}>
                  {a.name} ({a.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Dokumen Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-700"
            >
              <option value="all">Semua Status Dokumen</option>
              <option value="verified">Hanya Terverifikasi (100% Siap)</option>
              <option value="pending">Menunggu Kelengkapan Berkas</option>
              <option value="rescheduled">Pernah Reschedule / Pindah Tanggal</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-700"
            >
              <option value="departureDate-asc">Tgl Berangkat: Terdekat</option>
              <option value="departureDate-desc">Tgl Berangkat: Terjauh</option>
              <option value="pilgrimName-asc">Nama: A - Z</option>
              <option value="pilgrimName-desc">Nama: Z - A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <th className="py-3.5 px-4 text-center w-12">No</th>
              <th className="py-3.5 px-4">Nama Jamaah & Penerbangan</th>
              <th className="py-3.5 px-4">Tgl Berangkat</th>
              <th className="py-3.5 px-3 text-center" title="Status Dokumen Terverifikasi Utama">
                <span className="block">Dok. Verif</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="Paspor Asli">
                <span className="block">Paspor</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="Pass Foto 4x6 Latar Putih">
                <span className="block">Pass Foto</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="KTP & Kartu Keluarga">
                <span className="block">KTP & KK</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="Vaksin Meningitis">
                <span className="block">Meningitis</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="Vaksin Polio">
                <span className="block">Polio</span>
              </th>
              <th className="py-3.5 px-3 text-center" title="Biometrik Bio Visa">
                <span className="block">Biometrik</span>
              </th>
              <th className="py-3.5 px-4 text-center">Aksi & Pindah Tgl</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredPilgrims.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Info className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada data jamaah yang cocok.</p>
                    <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPilgrims.map((pilgrim, index) => {
                const isSaudia = pilgrim.airline === 'Saudia Airlines';
                return (
                  <tr 
                    key={pilgrim.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Nama Jamaah & Penerbangan */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {pilgrim.pilgrimName}
                          </span>
                          {pilgrim.isRescheduled && (
                            <span 
                              title="Jadwal jamaah pernah dipindahkan. Dokumen otomatis terbawa utuh."
                              className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5"
                            >
                              <CalendarClock className="w-2.5 h-2.5" />
                              Pindah Tgl
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isSaudia 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Plane className="w-3 h-3 mr-1" />
                            {pilgrim.airline}
                          </span>
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                            {pilgrim.flightCode}
                          </span>
                          {pilgrim.passportNumber && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Paspor: {pilgrim.passportNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tanggal Keberangkatan */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(pilgrim.departureDate)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pilgrim.departureDate}
                        </span>
                      </div>
                    </td>

                    {/* 7 CHECKLIST BUTTONS (INTERACTIVE REALTIME) */}
                    {/* 1. Dokumen Terverifikasi Utama */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.docVerified, pilgrim.id, 'docVerified', 'Dokumen Terverifikasi')}
                    </td>

                    {/* 2. Paspor */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.passport, pilgrim.id, 'passport', 'Paspor')}
                    </td>

                    {/* 3. Pass Foto */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.photo, pilgrim.id, 'photo', 'Pass Foto')}
                    </td>

                    {/* 4. KTP & KK */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.ktpkk, pilgrim.id, 'ktpkk', 'KTP & KK')}
                    </td>

                    {/* 5. Vaksin Meningitis */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.meningitis, pilgrim.id, 'meningitis', 'Vaksin Meningitis')}
                    </td>

                    {/* 6. Vaksin Polio */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.polio, pilgrim.id, 'polio', 'Vaksin Polio')}
                    </td>

                    {/* 7. Biometrik */}
                    <td className="py-3.5 px-3 text-center">
                      {renderDocBadge(pilgrim.biometric, pilgrim.id, 'biometric', 'Biometrik')}
                    </td>

                    {/* ACTIONS: Edit, Pindah Tgl Cepat, Hapus */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Quick Reschedule */}
                        <button
                          onClick={() => onQuickReschedule(pilgrim)}
                          title="Pindah Tanggal Keberangkatan (Berkas otomatis ikut terpindah)"
                          className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(pilgrim)}
                          title="Edit Lengkap Jamaah"
                          className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Hapus */}
                        <button
                          onClick={() => onDeleteRequest(pilgrim)}
                          title="Hapus Jamaah"
                          className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="font-semibold text-slate-700">Keterangan:</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
            Terverifikasi / Lengkap
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">✗</span>
            Belum Lengkap / Kurang
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="w-3.5 h-3.5 text-blue-600" />
            Tombol Reschedule (Pindah Tgl)
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Sistem Verifikasi Dokumen Haji & Umrah
        </div>
      </div>
    </div>
  );
};
