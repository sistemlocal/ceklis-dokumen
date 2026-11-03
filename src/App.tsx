/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { JamaahTable } from './components/JamaahTable';
import { JamaahForm } from './components/JamaahForm';
import { FlightManifestView } from './components/FlightManifestView';
import { RescheduleLogView } from './components/RescheduleLogView';
import { ReportExportModal } from './components/ReportExportModal';
import { RescheduleModal } from './components/RescheduleModal';
import { RescheduleView } from './components/RescheduleView';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { Pilgrim, DocumentChecklist, RescheduleHistoryItem } from './types/jamaah';
import { INITIAL_PILGRIMS, INITIAL_RESCHEDULE_LOGS } from './data/initialData';
import { exportPilgrimsToExcel, exportPilgrimsToPDF } from './utils/exportUtils';

const STORAGE_KEY_PILGRIMS = 'fandiego_pilgrims_v1';
const STORAGE_KEY_LOGS = 'fandiego_reschedule_logs_v1';

export default function App() {
  // 1. Data State with LocalStorage
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PILGRIMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading pilgrims from localStorage', e);
    }
    return INITIAL_PILGRIMS;
  });

  const [rescheduleLogs, setRescheduleLogs] = useState<RescheduleHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading logs from localStorage', e);
    }
    return INITIAL_RESCHEDULE_LOGS;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PILGRIMS, JSON.stringify(pilgrims));
    } catch (e) {
      console.error('Error saving pilgrims to localStorage', e);
    }
  }, [pilgrims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(rescheduleLogs));
    } catch (e) {
      console.error('Error saving logs to localStorage', e);
    }
  }, [rescheduleLogs]);

  // 2. Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [tableFilterStatus, setTableFilterStatus] = useState<string>('all');

  // 3. Modal / Edit States
  const [editingPilgrim, setEditingPilgrim] = useState<Pilgrim | null>(null);
  const [reschedulingPilgrim, setReschedulingPilgrim] = useState<Pilgrim | null>(null);
  const [deletingPilgrim, setDeletingPilgrim] = useState<Pilgrim | null>(null);

  // 4. Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [selectedRescheduleId, setSelectedRescheduleId] = useState<string | null>(null);

  // Toggle 3-bar sidebar
  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // 1. INPUT / EDIT JAMAAH (Terpisah Murni Tanpa Pindah Tanggal)
  const handleSavePilgrim = (
    data: Omit<Pilgrim, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const nowIso = new Date().toISOString();

    if (editingPilgrim) {
      // Update data identitas & verifikasi berkas jamaah
      const updatedPilgrim: Pilgrim = {
        ...data,
        id: editingPilgrim.id,
        departureDate: editingPilgrim.departureDate, // Tetap sesuai jadwal
        createdAt: editingPilgrim.createdAt,
        updatedAt: nowIso,
        isRescheduled: editingPilgrim.isRescheduled,
        rescheduleHistory: editingPilgrim.rescheduleHistory || []
      };

      setPilgrims(prev => prev.map(p => p.id === editingPilgrim.id ? updatedPilgrim : p));
      setEditingPilgrim(null);
      addToast(
        'Data Jamaah Diperbarui',
        `Perubahan identitas dan verifikasi berkas ${data.pilgrimName} berhasil disimpan.`,
        'success'
      );
      setActiveTab('table');
    } else {
      // Pendaftaran Jamaah Baru
      const newId = `JM-${String(pilgrims.length + 1).padStart(3, '0')}`;

      const newPilgrim: Pilgrim = {
        ...data,
        id: newId,
        createdAt: nowIso,
        updatedAt: nowIso,
        isRescheduled: false
      };

      setPilgrims(prev => [newPilgrim, ...prev]);
      addToast(
        'Jamaah Baru Terdaftar',
        `${data.pilgrimName} berhasil didaftarkan untuk penerbangan ${data.airline} (${data.flightCode}) pada ${data.departureDate}.`,
        'success'
      );
      setActiveTab('table');
    }
  };

  // Quick Reschedule Confirm Modal
  const handleConfirmQuickReschedule = (
    pilgrimId: string, 
    newDate: string, 
    newFlightCode?: string, 
    reason?: string
  ) => {
    const target = pilgrims.find(p => p.id === pilgrimId);
    if (!target) return;

    const nowIso = new Date().toISOString();
    const effectiveFlight = newFlightCode || target.flightCode;

    const newLogItem: RescheduleHistoryItem = {
      id: `RSC-${Date.now().toString().slice(-4)}`,
      pilgrimId: target.id,
      pilgrimName: target.pilgrimName,
      oldDate: target.departureDate,
      newDate,
      oldFlightCode: target.flightCode,
      newFlightCode: effectiveFlight,
      rescheduledAt: nowIso,
      notes: reason || 'Pemindahan jadwal cepat via tombol Reschedule.',
      documentsCarriedOver: {
        docVerified: target.docVerified,
        passport: target.passport,
        photo: target.photo,
        ktpkk: target.ktpkk,
        meningitis: target.meningitis,
        polio: target.polio,
        biometric: target.biometric
      }
    };

    const updatedPilgrim: Pilgrim = {
      ...target,
      departureDate: newDate,
      flightCode: effectiveFlight,
      isRescheduled: true,
      updatedAt: nowIso,
      rescheduleHistory: [newLogItem, ...(target.rescheduleHistory || [])]
    };

    setPilgrims(prev => prev.map(p => p.id === pilgrimId ? updatedPilgrim : p));
    setRescheduleLogs(prev => [newLogItem, ...prev]);
    setReschedulingPilgrim(null);

    addToast(
      'Pindah Tanggal Berhasil',
      `Jadwal ${target.pilgrimName} berhasil digeser ke ${newDate}. Seluruh 7 dokumen otomatis ikut terpindah!`,
      'success'
    );
  };

  // Quick Toggle document status in Table
  const handleToggleDocStatus = (pilgrimId: string, docKey: keyof DocumentChecklist) => {
    setPilgrims(prev => prev.map(p => {
      if (p.id !== pilgrimId) return p;

      const newStatus = !p[docKey];
      const updated = { ...p, [docKey]: newStatus, updatedAt: new Date().toISOString() };

      // If toggling a sub-document and all 6 become true, auto-check docVerified
      if (docKey !== 'docVerified') {
        const all6Ok = 
          (docKey === 'passport' ? newStatus : p.passport) &&
          (docKey === 'photo' ? newStatus : p.photo) &&
          (docKey === 'ktpkk' ? newStatus : p.ktpkk) &&
          (docKey === 'meningitis' ? newStatus : p.meningitis) &&
          (docKey === 'polio' ? newStatus : p.polio) &&
          (docKey === 'biometric' ? newStatus : p.biometric);
        
        if (all6Ok) {
          updated.docVerified = true;
        }
      }

      return updated;
    }));

    const target = pilgrims.find(p => p.id === pilgrimId);
    if (target) {
      addToast(
        'Status Berkas Diperbarui',
        `Status ${docKey} untuk ${target.pilgrimName} berhasil diperbarui secara realtime.`,
        'info'
      );
    }
  };

  // Handle Edit Action
  const handleEditPilgrim = (pilgrim: Pilgrim) => {
    setEditingPilgrim(pilgrim);
    setActiveTab('form');
  };

  // Handle Delete Action
  const handleConfirmDelete = (pilgrimId: string) => {
    const target = pilgrims.find(p => p.id === pilgrimId);
    setPilgrims(prev => prev.filter(p => p.id !== pilgrimId));
    setDeletingPilgrim(null);

    addToast(
      'Data Jamaah Dihapus',
      `Data jamaah ${target?.pilgrimName || ''} telah dihapus dari sistem.`,
      'warning'
    );
  };

  // Excel & PDF quick export
  const handleExportExcelAll = () => {
    try {
      exportPilgrimsToExcel(pilgrims, 'Laporan_Verifikasi_Jamaah_Haji_Umrah');
      addToast('Unduh Excel Berhasil', 'File spreadsheet laporan jamaah telah diunduh.', 'success');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleExportPDFAll = () => {
    try {
      exportPilgrimsToPDF(pilgrims, 'Laporan Verifikasi Dokumen Jamaah Haji & Umrah');
      addToast('Unduh PDF Berhasil', 'File PDF resmi siap cetak telah diunduh.', 'success');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard & Statistik Verifikasi';
      case 'table': return 'Data Dokumen Jamaah & Manifest';
      case 'form': return editingPilgrim ? 'Edit Data Identitas & Dokumen Jamaah' : 'Input Jamaah Baru & Verifikasi Dokumen';
      case 'reschedule': return 'Menu Khusus Pindah Tanggal (Reschedule & Mutasi Berkas)';
      case 'manifest': return 'Jadwal Flight & Manifest Keberangkatan';
      case 'reschedule-log': return 'Riwayat Mutasi Jadwal & Berkas';
      case 'export': return 'Pusat Unduh Laporan (Excel & PDF)';
      default: return 'Sistem Verifikasi Dokumen';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* 3-BAR TOGGLE SIDEBAR (Slide kanan buka, slide kiri tutup) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'form') setEditingPilgrim(null);
        }}
        pilgrims={pilgrims}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* NAVBAR with 3-bar toggle button, clocks, quick export */}
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onExportExcel={handleExportExcelAll}
          onExportPDF={handleExportPDFAll}
          pilgrims={pilgrims}
          activeTabTitle={getTabTitle()}
        />

        {/* SCROLLABLE MAIN BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* VIEW 1: DASHBOARD STATS */}
            {activeTab === 'dashboard' && (
              <DashboardStats
                pilgrims={pilgrims}
                onNavigateToTable={(filter = 'all') => {
                  setTableFilterStatus(filter);
                  setActiveTab('table');
                }}
                onNavigateToForm={() => {
                  setEditingPilgrim(null);
                  setActiveTab('form');
                }}
                onNavigateToReschedule={() => {
                  setActiveTab('reschedule');
                }}
              />
            )}

            {/* VIEW 2: TABLE DATA JAMAAH */}
            {activeTab === 'table' && (
              <JamaahTable
                pilgrims={pilgrims}
                onEdit={handleEditPilgrim}
                onDeleteRequest={(p) => setDeletingPilgrim(p)}
                onQuickReschedule={(p) => {
                  setSelectedRescheduleId(p.id);
                  setActiveTab('reschedule');
                }}
                onToggleDocStatus={handleToggleDocStatus}
                onExportExcel={handleExportExcelAll}
                onExportPDF={handleExportPDFAll}
                initialFilterStatus={tableFilterStatus}
              />
            )}

            {/* VIEW 3: FORM INPUT JAMAAH BARU (MURNI PENDAFTARAN & DOKUMEN) */}
            {activeTab === 'form' && (
              <JamaahForm
                onSave={handleSavePilgrim}
                editingPilgrim={editingPilgrim}
                onCancelEdit={() => {
                  setEditingPilgrim(null);
                  setActiveTab('table');
                }}
                onNavigateToReschedule={() => {
                  setActiveTab('reschedule');
                }}
              />
            )}

            {/* VIEW 4: MENU KHUSUS PINDAH TANGGAL (RESCHEDULE & MUTASI OTOMATIS) */}
            {activeTab === 'reschedule' && (
              <RescheduleView
                pilgrims={pilgrims}
                selectedPilgrimId={selectedRescheduleId}
                onConfirmReschedule={handleConfirmQuickReschedule}
                onNavigateToHistory={() => setActiveTab('reschedule-log')}
              />
            )}

            {/* VIEW 5: JADWAL FLIGHT & MANIFEST */}
            {activeTab === 'manifest' && (
              <FlightManifestView
                pilgrims={pilgrims}
                onEdit={handleEditPilgrim}
                onQuickReschedule={(p) => {
                  setSelectedRescheduleId(p.id);
                  setActiveTab('reschedule');
                }}
              />
            )}

            {/* VIEW 6: RIWAYAT MUTASI PINDAH TANGGAL */}
            {activeTab === 'reschedule-log' && (
              <RescheduleLogView logs={rescheduleLogs} />
            )}

            {/* VIEW 7: PUSAT EKSPOR LAPORAN */}
            {activeTab === 'export' && (
              <ReportExportModal pilgrims={pilgrims} />
            )}
          </div>
        </main>
      </div>

      {/* QUICK RESCHEDULE MODAL */}
      <RescheduleModal
        pilgrim={reschedulingPilgrim}
        onClose={() => setReschedulingPilgrim(null)}
        onConfirm={handleConfirmQuickReschedule}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        pilgrim={deletingPilgrim}
        onClose={() => setDeletingPilgrim(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* REAL-TIME TOAST NOTIFICATIONS */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
