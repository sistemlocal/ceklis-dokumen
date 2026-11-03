import React from 'react';
import { 
  CalendarClock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  User, 
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { RescheduleHistoryItem } from '../types/jamaah';
import { exportRescheduleLogToExcel } from '../utils/exportUtils';

interface RescheduleLogViewProps {
  logs: RescheduleHistoryItem[];
}

export const RescheduleLogView: React.FC<RescheduleLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Audit Trail Sistem
              </span>
              <span className="text-xs text-blue-300">
                Otomatisasi Sinkronisasi Dokumen
              </span>
            </div>
            <h3 className="text-xl font-extrabold mt-2 tracking-tight">
              Riwayat Mutasi & Pindah Tanggal Keberangkatan
            </h3>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Catatan kepindahan jadwal penerbangan jamaah. Setiap ada pemindahan tanggal, seluruh 7 berkas kelengkapan (Paspor, Foto, KTP/KK, Vaksin Meningitis, Vaksin Polio, dan Biometrik) dijamin 100% otomatis ikut terpindah ke manifest jadwal baru.
            </p>
          </div>

          <button
            onClick={() => exportRescheduleLogToExcel(logs)}
            disabled={logs.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-900/30 flex items-center gap-2 self-start md:self-center shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor Riwayat Excel
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Riwayat Pindah Tanggal</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Jika jadwal jamaah dipindahkan, catatan riwayat dan konfirmasi dokumen akan tercatat di sini.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const timeFormatted = new Date(log.rescheduledAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const docs = log.documentsCarriedOver;

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {log.pilgrimName}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          ID: {log.pilgrimId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Waktu Mutasi: {timeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Transition Card */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start lg:self-center">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Jadwal Asli</div>
                      <div className="font-mono font-bold text-xs text-slate-700">{log.oldDate}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-600">Jadwal Baru</div>
                      <div className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {log.newDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status of Carried-over Documents */}
                <div className="mt-4 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Status Dokumen Otomatis Terbawa ke Jadwal Baru:
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      100% Terpelihara & Terpindah
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                    <div className={`p-2 rounded-xl text-center border ${
                      docs.docVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Dok. Terverif</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.docVerified ? '✓ Sah' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.passport ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Paspor</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.passport ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.photo ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Pass Foto</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.photo ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.ktpkk ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">KTP & KK</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.ktpkk ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.meningitis ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Meningitis</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.meningitis ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.polio ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Polio</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.polio ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>

                    <div className={`p-2 rounded-xl text-center border ${
                      docs.biometric ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <div className="font-bold text-[10px]">Biometrik</div>
                      <div className="text-xs font-semibold mt-0.5">{docs.biometric ? '✓ Lengkap' : '✗ Belum'}</div>
                    </div>
                  </div>

                  {log.notes && (
                    <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600">
                      <strong className="text-slate-800">Alasan Pindah: </strong> {log.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
