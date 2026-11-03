import React, { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  FileText,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Pilgrim } from '../types/jamaah';
import { exportPilgrimsToExcel, exportPilgrimsToPDF } from '../utils/exportUtils';

interface FlightManifestViewProps {
  pilgrims: Pilgrim[];
  onEdit: (pilgrim: Pilgrim) => void;
  onQuickReschedule: (pilgrim: Pilgrim) => void;
}

interface FlightGroup {
  flightKey: string;
  airline: string;
  flightCode: string;
  departureDate: string;
  pilgrims: Pilgrim[];
  total: number;
  verified: number;
}

export const FlightManifestView: React.FC<FlightManifestViewProps> = ({
  pilgrims,
  onEdit,
  onQuickReschedule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Group by Airline + Flight Code + Departure Date
  const flightGroups = React.useMemo(() => {
    const groups: Record<string, FlightGroup> = {};

    pilgrims.forEach(p => {
      const key = `${p.airline}_${p.flightCode}_${p.departureDate}`;
      if (!groups[key]) {
        groups[key] = {
          flightKey: key,
          airline: p.airline,
          flightCode: p.flightCode,
          departureDate: p.departureDate,
          pilgrims: [],
          total: 0,
          verified: 0
        };
      }
      groups[key].pilgrims.push(p);
      groups[key].total += 1;
      if (p.docVerified) groups[key].verified += 1;
    });

    return Object.values(groups).sort((a, b) => a.departureDate.localeCompare(b.departureDate));
  }, [pilgrims]);

  const filteredGroups = flightGroups.filter(g => {
    const term = searchTerm.toLowerCase();
    return (
      g.airline.toLowerCase().includes(term) ||
      g.flightCode.toLowerCase().includes(term) ||
      g.departureDate.includes(term) ||
      g.pilgrims.some(p => p.pilgrimName.toLowerCase().includes(term))
    );
  });

  const toggleExpand = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plane className="w-5 h-5 text-emerald-600" />
            Jadwal Flight & Manifest Keberangkatan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dikelompokkan per maskapai internasional, nomor penerbangan, dan tanggal terbang.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari flight, maskapai, tanggal..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            Tidak ada penerbangan yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredGroups.map(group => {
            const isExpanded = expandedGroups[group.flightKey] ?? true; // default expanded
            const pct = Math.round((group.verified / group.total) * 100);
            const isSaudia = group.airline === 'Saudia Airlines';

            return (
              <div 
                key={group.flightKey}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                {/* Header Card */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isSaudia 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-800 text-white'
                    }`}>
                      <Plane className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-base">
                          {group.airline}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg font-mono font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {group.flightCode}
                        </span>
                        {isSaudia && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            Saudi Direct
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Keberangkatan: {group.departureDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {group.total} Jamaah
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Readiness & Export Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Readiness Bar */}
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700">
                        {group.verified} / {group.total} Siap ({pct}%)
                      </div>
                      <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Flight Export Buttons */}
                    <button
                      onClick={() => exportPilgrimsToExcel(group.pilgrims, `Manifest_${group.flightCode}_${group.departureDate}`)}
                      title="Download Manifest Excel Flight ini"
                      className="p-2 rounded-xl text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 shadow-xs transition"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => exportPilgrimsToPDF(group.pilgrims, `Manifest Keberangkatan ${group.airline} ${group.flightCode}`)}
                      title="Download Manifest PDF Flight ini"
                      className="p-2 rounded-xl text-rose-800 bg-white hover:bg-rose-50 border border-rose-300 shadow-xs transition"
                    >
                      <FileText className="w-4 h-4 text-rose-600" />
                    </button>

                    {/* Collapse / Expand Toggle */}
                    <button
                      onClick={() => toggleExpand(group.flightKey)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Manifest Table if Expanded */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-500 text-[11px] uppercase font-semibold border-b border-slate-200">
                          <th className="py-2.5 px-4 w-12 text-center">No</th>
                          <th className="py-2.5 px-4">Nama Jamaah</th>
                          <th className="py-2.5 px-4">No. Paspor</th>
                          <th className="py-2.5 px-3 text-center">Dok. Verif</th>
                          <th className="py-2.5 px-3 text-center">Paspor</th>
                          <th className="py-2.5 px-3 text-center">Foto</th>
                          <th className="py-2.5 px-3 text-center">KTP/KK</th>
                          <th className="py-2.5 px-3 text-center">Meningitis</th>
                          <th className="py-2.5 px-3 text-center">Polio</th>
                          <th className="py-2.5 px-3 text-center">Biometrik</th>
                          <th className="py-2.5 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {group.pilgrims.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-800">
                              {p.pilgrimName}
                              {p.isRescheduled && (
                                <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-normal">
                                  Pindah Tgl
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-600">
                              {p.passportNumber || '-'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {p.docVerified ? (
                                <span className="text-emerald-700 font-bold">✓ OK</span>
                              ) : (
                                <span className="text-rose-500 font-bold">✗ Belum</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">{p.passport ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-3 text-center">{p.photo ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-3 text-center">{p.ktpkk ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-3 text-center">{p.meningitis ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-3 text-center">{p.polio ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-3 text-center">{p.biometric ? '✓' : '✗'}</td>
                            <td className="py-2.5 px-4 text-center">
                              <button
                                onClick={() => onQuickReschedule(p)}
                                className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition"
                              >
                                Pindah Tgl
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
