import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Filter, 
  CheckCircle2, 
  Calendar, 
  Plane,
  Printer,
  Sparkles
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';
import { AIRLINES_LIST } from '../data/airlineData';
import { exportPilgrimsToExcel, exportPilgrimsToPDF } from '../utils/exportUtils';

interface ReportExportModalProps {
  pilgrims: Pilgrim[];
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ pilgrims }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAirline, setFilterAirline] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredPilgrims = pilgrims.filter(p => {
    if (filterStatus === 'verified' && !p.docVerified) return false;
    if (filterStatus === 'pending' && p.docVerified) return false;
    if (filterStatus === 'rescheduled' && !p.isRescheduled) return false;

    if (filterAirline !== 'all' && p.airline !== filterAirline) return false;

    if (startDate && p.departureDate < startDate) return false;
    if (endDate && p.departureDate > endDate) return false;

    return true;
  });

  const handleExcelExport = () => {
    exportPilgrimsToExcel(
      filteredPilgrims, 
      `Laporan_Verifikasi_Jamaah_${filterStatus}_${filterAirline !== 'all' ? filterAirline.replace(/\s+/g, '_') : 'Semua'}`
    );
  };

  const handlePDFExport = () => {
    exportPilgrimsToPDF(
      filteredPilgrims,
      `Laporan Verifikasi Dokumen Jamaah (${filteredPilgrims.length} Jamaah)`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              Pusat Unduh Laporan Excel & PDF
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sesuaikan kriteria filter laporan verifikasi dokumen jamaah sebelum mengunduh berkas.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-center">
            {filteredPilgrims.length} Jamaah Siap Diekspor
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
          {/* Status Dokumen */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Status Kelengkapan Dokumen
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Jamaah ({pilgrims.length})</option>
              <option value="verified">Hanya Dokumen Lengkap / Verified</option>
              <option value="pending">Hanya Dokumen Belum Lengkap</option>
              <option value="rescheduled">Hanya Jamaah Pindah Tanggal</option>
            </select>
          </div>

          {/* Maskapai */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Pilihan Maskapai Penerbangan
            </label>
            <select
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Maskapai Internasional</option>
              <option value="Saudia Airlines">Saudia Airlines (SV)</option>
              {AIRLINES_LIST.filter(a => a.name !== 'Saudia Airlines').map(a => (
                <option key={a.code} value={a.name}>
                  {a.name} ({a.code})
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Mulai */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Dari Tanggal Keberangkatan
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Tanggal Sampai */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Sampai Tanggal Keberangkatan
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Big Export Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          {/* Excel Button */}
          <button
            onClick={handleExcelExport}
            disabled={filteredPilgrims.length === 0}
            className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-950 flex items-center justify-between transition group shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 group-hover:scale-105 transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Unduh Format Excel</span>
                <span className="text-[11px] text-emerald-700">File Spreadsheet .XLSX</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-700 group-hover:translate-y-0.5 transition" />
          </button>

          {/* PDF Button */}
          <button
            onClick={handlePDFExport}
            disabled={filteredPilgrims.length === 0}
            className="p-4 rounded-2xl border-2 border-rose-500 bg-rose-50/50 hover:bg-rose-100 text-rose-950 flex items-center justify-between transition group shadow-xs disabled:opacity-50"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30 group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Unduh Format PDF</span>
                <span className="text-[11px] text-rose-700">Dokumen Resmi Siap Cetak</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-rose-700 group-hover:translate-y-0.5 transition" />
          </button>

          {/* Direct Print Button */}
          <button
            onClick={handlePrint}
            className="p-4 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between transition group shadow-xs"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Cetak Langsung (Print)</span>
                <span className="text-[11px] text-slate-500">Dialog Print Browser</span>
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-600 group-hover:scale-110 transition" />
          </button>
        </div>
      </div>

      {/* Preview Table of Records */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h4 className="text-sm font-bold text-slate-800 mb-3">
          Pratinjau Data yang Akan Diekspor ({filteredPilgrims.length} Baris Data)
        </h4>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">Nama Jamaah</th>
                <th className="py-2.5 px-3">Maskapai</th>
                <th className="py-2.5 px-3">Flight</th>
                <th className="py-2.5 px-3">Tgl Berangkat</th>
                <th className="py-2.5 px-3 text-center">Verif</th>
                <th className="py-2.5 px-3 text-center">Paspor</th>
                <th className="py-2.5 px-3 text-center">Foto</th>
                <th className="py-2.5 px-3 text-center">KTP/KK</th>
                <th className="py-2.5 px-3 text-center">Meningitis</th>
                <th className="py-2.5 px-3 text-center">Polio</th>
                <th className="py-2.5 px-3 text-center">Biometrik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPilgrims.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{p.pilgrimName}</td>
                  <td className="py-2 px-3">{p.airline}</td>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-800">{p.flightCode}</td>
                  <td className="py-2 px-3">{p.departureDate}</td>
                  <td className="py-2 px-3 text-center">{p.docVerified ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.passport ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.photo ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.ktpkk ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.meningitis ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.polio ? '✓' : '✗'}</td>
                  <td className="py-2 px-3 text-center">{p.biometric ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
