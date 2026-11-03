import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Plane, 
  CalendarClock, 
  FileSpreadsheet, 
  ShieldCheck, 
  X,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pilgrims: Pilgrim[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  pilgrims
}) => {
  const verifiedCount = pilgrims.filter(p => p.docVerified).length;
  const pendingCount = pilgrims.length - verifiedCount;
  const rescheduledCount = pilgrims.filter(p => p.isRescheduled).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard & Ringkasan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'table',
      label: 'Data Jamaah & Verifikasi',
      icon: Users,
      badge: pilgrims.length
    },
    {
      id: 'form',
      label: 'Input Jamaah Baru',
      icon: UserPlus,
      badge: null
    },
    {
      id: 'reschedule',
      label: 'Pindah Tanggal (Reschedule)',
      icon: CalendarClock,
      badge: 'Auto-Sync',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
    },
    {
      id: 'manifest',
      label: 'Jadwal Flight & Manifest',
      icon: Plane,
      badge: null
    },
    {
      id: 'reschedule-log',
      label: 'Riwayat Mutasi Jadwal',
      icon: Clock,
      badge: rescheduledCount > 0 ? `${rescheduledCount} Mutasi` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300'
    },
    {
      id: 'export',
      label: 'Pusat Ekspor Laporan',
      icon: FileSpreadsheet,
      badge: 'Excel & PDF'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container: Slide kanan buka, slide kiri tutup */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 border border-emerald-400/40">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-base tracking-wide text-white">Fandiego</h1>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  TOURS & TRAVEL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Haji Khusus & Umrah</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Status Card */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif Realtime
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Verified</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {verifiedCount} Jamaah
              </div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Pending</div>
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {pendingCount} Jamaah
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Operasional
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badgeColor 
                      ? item.badgeColor
                      : isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Pindah Tgl Otomatis</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Sinkron 100%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Semua file dan status dokumen otomatis ikut terpindah jika jadwal tanggal digeser.
          </p>
        </div>
      </aside>
    </>
  );
};
