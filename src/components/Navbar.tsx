import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  Bell, 
  CheckCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onExportExcel: () => void;
  onExportPDF: () => void;
  pilgrims: Pilgrim[];
  activeTabTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onExportExcel,
  onExportPDF,
  pilgrims,
  activeTabTitle
}) => {
  const [timeWib, setTimeWib] = useState<string>('');
  const [timeKsa, setTimeKsa] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // WIB = UTC+7
      setTimeWib(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      // Makkah = UTC+3
      setTimeKsa(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Riyadh',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const total = pilgrims.length;
  const verified = pilgrims.filter(p => p.docVerified).length;
  const rescheduled = pilgrims.filter(p => p.isRescheduled).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Left: 3-Bar Toggle & Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Toggle 3 Bar (Hamburger) */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all flex items-center justify-center group active:scale-95"
          title="Toggle Menu (3 Bar)"
        >
          <Menu className="w-5 h-5 transition-transform group-hover:rotate-3 text-slate-700 group-hover:text-emerald-700" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              {activeTabTitle}
            </h2>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Verifikasi Dokumen Kelengkapan Penerbangan Haji & Umrah
          </p>
        </div>
      </div>

      {/* Right: Clocks, Export shortcuts, Notification & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Clocks (Jakarta & Makkah) */}
        <div className="hidden xl:flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">{timeWib}</span>
            <span className="text-[10px] text-slate-500 font-medium bg-slate-200/80 px-1 py-0.2 rounded">WIB</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200"></div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span className="font-semibold text-emerald-700">{timeKsa}</span>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100 px-1 py-0.2 rounded">Makkah</span>
          </div>
        </div>

        {/* Quick Action: Export Excel */}
        <button
          onClick={onExportExcel}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs transition active:scale-95"
          title="Download Laporan Format Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Excel</span>
        </button>

        {/* Quick Action: Export PDF */}
        <button
          onClick={onExportPDF}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 shadow-xs transition active:scale-95"
          title="Download Laporan Format PDF Resmi"
        >
          <FileText className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">PDF</span>
        </button>

        {/* Notifications button with popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 relative transition active:scale-95"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {rescheduled > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {rescheduled}
              </span>
            )}
          </button>

          {showNotification && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Status Mutasi & Verifikasi
                </span>
                <span className="text-[11px] text-slate-500">Realtime</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start space-x-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-emerald-900">
                      {verified} dari {total} Jamaah Terverifikasi
                    </span>
                    <p className="text-emerald-700 text-[11px] mt-0.5">
                      Kelengkapan paspor, visa biometrik, & sertifikat vaksinasi lengkap.
                    </p>
                  </div>
                </div>

                {rescheduled > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-amber-900">
                        {rescheduled} Jamaah Pindah Tanggal
                      </span>
                      <p className="text-amber-700 text-[11px] mt-0.5">
                        Semua file dan status dokumen otomatis ikut terpindah ke jadwal baru.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-600 to-emerald-700 text-white font-bold text-sm flex items-center justify-center shadow-xs border border-emerald-500">
            FD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">Admin Dokumen</p>
            <p className="text-[10px] text-slate-500">Fandiego Tours & Travel</p>
          </div>
        </div>
      </div>
    </header>
  );
};
