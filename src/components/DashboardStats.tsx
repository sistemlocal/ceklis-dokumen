import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  FileCheck, 
  Fingerprint, 
  Syringe, 
  Image, 
  IdCard, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';

interface DashboardStatsProps {
  pilgrims: Pilgrim[];
  onNavigateToTable: (filter?: string) => void;
  onNavigateToForm: () => void;
  onNavigateToReschedule?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  pilgrims,
  onNavigateToTable,
  onNavigateToForm,
  onNavigateToReschedule
}) => {
  const total = pilgrims.length;
  const verified = pilgrims.filter(p => p.docVerified).length;
  const pending = total - verified;
  const rescheduled = pilgrims.filter(p => p.isRescheduled).length;

  const docStats = [
    {
      key: 'docVerified',
      label: 'Dokumen Terverifikasi',
      count: pilgrims.filter(p => p.docVerified).length,
      icon: FileCheck,
      color: 'emerald'
    },
    {
      key: 'passport',
      label: 'Paspor Asli Sesuai',
      count: pilgrims.filter(p => p.passport).length,
      icon: BookOpen,
      color: 'blue'
    },
    {
      key: 'photo',
      label: 'Pass Foto (4x6 Latar Putih)',
      count: pilgrims.filter(p => p.photo).length,
      icon: Image,
      color: 'purple'
    },
    {
      key: 'ktpkk',
      label: 'KTP & Kartu Keluarga',
      count: pilgrims.filter(p => p.ktpkk).length,
      icon: IdCard,
      color: 'amber'
    },
    {
      key: 'meningitis',
      label: 'Vaksin Meningitis',
      count: pilgrims.filter(p => p.meningitis).length,
      icon: Syringe,
      color: 'rose'
    },
    {
      key: 'polio',
      label: 'Vaksin Polio nOPV2',
      count: pilgrims.filter(p => p.polio).length,
      icon: Syringe,
      color: 'teal'
    },
    {
      key: 'biometric',
      label: 'Biometrik (Bio Visa KSA)',
      count: pilgrims.filter(p => p.biometric).length,
      icon: Fingerprint,
      color: 'indigo'
    }
  ];

  // Group by upcoming dates
  const upcomingFlights = pilgrims.reduce((acc, p) => {
    const key = `${p.airline} - ${p.flightCode} (${p.departureDate})`;
    if (!acc[key]) {
      acc[key] = {
        airline: p.airline,
        flightCode: p.flightCode,
        date: p.departureDate,
        total: 0,
        verified: 0
      };
    }
    acc[key].total += 1;
    if (p.docVerified) acc[key].verified += 1;
    return acc;
  }, {} as Record<string, { airline: string; flightCode: string; date: string; total: number; verified: number }>);

  const upcomingList = Object.values(upcomingFlights).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Jamaah */}
        <div 
          onClick={() => onNavigateToTable('all')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Jamaah Terdata
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
                {total}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Semua manifest terdaftar
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Buka daftar jamaah</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-slate-800" />
          </div>
        </div>

        {/* Card 2: Terverifikasi Penuh */}
        <div 
          onClick={() => onNavigateToTable('verified')}
          className="bg-linear-to-br from-emerald-50 to-emerald-100/60 rounded-2xl p-5 border border-emerald-200 shadow-xs hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Dokumen Terverifikasi
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">
                {verified}
              </h3>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                {total > 0 ? Math.round((verified / total) * 100) : 0}% Siap Keberangkatan
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-medium">
            <span>Lihat jamaah lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Menunggu Verifikasi */}
        <div 
          onClick={() => onNavigateToTable('pending')}
          className="bg-linear-to-br from-amber-50 to-amber-100/60 rounded-2xl p-5 border border-amber-200 shadow-xs hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Menunggu Kelengkapan
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1">
                {pending}
              </h3>
              <p className="text-xs text-amber-700 mt-1 font-medium">
                Perlu tindak lanjut berkas
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-800 font-medium">
            <span>Filter jamaah pending</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Rescheduled / Pindah Tanggal */}
        <div 
          onClick={() => onNavigateToTable('rescheduled')}
          className="bg-linear-to-br from-blue-50 to-blue-100/60 rounded-2xl p-5 border border-blue-200 shadow-xs hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                Pindah Tanggal
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">
                {rescheduled}
              </h3>
              <p className="text-xs text-blue-700 mt-1 font-medium">
                Berkas otomatis terbawa
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
              <CalendarClock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs text-blue-800 font-medium">
            <span>Riwayat mutasi tgl</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Grid: 7 Document Breakdown & Upcoming Flights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7 Document Checklist Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tingkat Kelengkapan 7 Dokumen Wajib
              </h3>
              <p className="text-xs text-slate-500">
                Status verifikasi berkas seluruh jamaah haji dan umrah
              </p>
            </div>
            <button
              onClick={onNavigateToForm}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              + Input Jamaah Baru
            </button>
          </div>

          <div className="space-y-4">
            {docStats.map((item) => {
              const Icon = item.icon;
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">
                        {item.count} / {total} Jamaah
                      </span>
                      <span className="font-bold text-slate-800 w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage === 100 
                          ? 'bg-emerald-600' 
                          : percentage > 70 
                            ? 'bg-blue-600' 
                            : percentage > 40 
                              ? 'bg-amber-500' 
                              : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Flights Manifest */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Jadwal Penerbangan
                </h3>
                <p className="text-xs text-slate-500">
                  Manifest grup keberangkatan
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {upcomingList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Belum ada penerbangan</p>
              ) : (
                upcomingList.map((flight, i) => {
                  const pct = Math.round((flight.verified / flight.total) * 100);
                  return (
                    <div 
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-800">
                          {flight.airline}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                          {flight.flightCode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Tgl: {flight.date}</span>
                        <span className="font-semibold text-emerald-700">
                          {flight.verified}/{flight.total} Siap ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Guarantee Box for Reschedule Auto-transfer */}
          <div className="mt-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <div className="font-bold flex items-center justify-between mb-1 text-blue-950">
              <span className="flex items-center gap-1.5">
                <CalendarClock className="w-4 h-4 text-blue-700" />
                Sistem Pindah Tanggal & Auto-Transfer
              </span>
              {onNavigateToReschedule && (
                <button
                  type="button"
                  onClick={onNavigateToReschedule}
                  className="text-[10px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  Pindah Tanggal →
                </button>
              )}
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Jika tanggal jamaah dipindahkan di menu Pindah Tanggal, sistem secara otomatis menjamin seluruh 7 berkas verifikasi tetap utuh dan ikut terpindah ke jadwal baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
