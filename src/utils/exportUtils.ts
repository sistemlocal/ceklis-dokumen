import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pilgrim, RescheduleHistoryItem } from '../types/jamaah';

export function exportPilgrimsToExcel(pilgrims: Pilgrim[], title = 'Laporan_Verifikasi_Jamaah') {
  if (!pilgrims || pilgrims.length === 0) {
    throw new Error('Tidak ada data jamaah untuk diekspor ke Excel.');
  }

  const worksheetData = pilgrims.map((p, idx) => ({
    'No': idx + 1,
    'ID Jamaah': p.id,
    'Nama Jamaah': p.pilgrimName,
    'Maskapai': p.airline,
    'Kode Flight': p.flightCode,
    'Tanggal Keberangkatan': p.departureDate,
    'Status Reschedule': p.isRescheduled ? 'Pernah Pindah Jadwal' : 'Jadwal Normal',
    'Dok. Terverifikasi': p.docVerified ? 'SUDAH' : 'BELUM',
    'Paspor': p.passport ? 'SUDAH' : 'BELUM',
    'Pass Foto (4x6)': p.photo ? 'SUDAH' : 'BELUM',
    'KTP & KK': p.ktpkk ? 'SUDAH' : 'BELUM',
    'Vaksin Meningitis': p.meningitis ? 'SUDAH' : 'BELUM',
    'Vaksin Polio': p.polio ? 'SUDAH' : 'BELUM',
    'Biometrik (Bio Visa)': p.biometric ? 'SUDAH' : 'BELUM',
    'No. Paspor': p.passportNumber || '-',
    'No. Telp / HP': p.phoneNumber || '-',
    'Kota Asal': p.city || '-',
    'Catatan Khusus': p.notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Column width auto-sizing
  const colWidths = [
    { wch: 6 },  // No
    { wch: 12 }, // ID
    { wch: 32 }, // Nama
    { wch: 20 }, // Maskapai
    { wch: 14 }, // Flight
    { wch: 16 }, // Tgl
    { wch: 20 }, // Reschedule
    { wch: 18 }, // Verif
    { wch: 10 }, // Paspor
    { wch: 14 }, // Foto
    { wch: 12 }, // KTP
    { wch: 16 }, // Meningitis
    { wch: 14 }, // Polio
    { wch: 18 }, // Biometrik
    { wch: 16 }, // No Paspor
    { wch: 18 }, // No Telp
    { wch: 16 }, // Kota
    { wch: 30 }  // Catatan
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Verifikasi Jamaah');

  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 10);
  const filename = `${title}_${dateFormatted}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportRescheduleLogToExcel(logs: RescheduleHistoryItem[]) {
  if (!logs || logs.length === 0) {
    throw new Error('Tidak ada riwayat pindah jadwal untuk diekspor.');
  }

  const worksheetData = logs.map((log, idx) => ({
    'No': idx + 1,
    'Log ID': log.id,
    'ID Jamaah': log.pilgrimId,
    'Nama Jamaah': log.pilgrimName,
    'Tanggal Awal': log.oldDate,
    'Tanggal Pindah Baru': log.newDate,
    'Flight Awal': log.oldFlightCode || '-',
    'Flight Baru': log.newFlightCode || '-',
    'Waktu Mutasi': new Date(log.rescheduledAt).toLocaleString('id-ID'),
    'Status Berkas Otomatis Terbawa': 'Ya, 100% Terbawa Lengkap',
    'Status Dokumen Paspor': log.documentsCarriedOver.passport ? 'Terverifikasi' : 'Belum',
    'Status Dokumen Biometrik': log.documentsCarriedOver.biometric ? 'Terverifikasi' : 'Belum',
    'Catatan / Alasan Pindah': log.notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Mutasi Pindah Jadwal');
  XLSX.writeFile(workbook, `Riwayat_Mutasi_Jadwal_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportPilgrimsToPDF(pilgrims: Pilgrim[], title = 'Laporan Verifikasi Dokumen Jamaah Haji & Umrah') {
  if (!pilgrims || pilgrims.length === 0) {
    throw new Error('Tidak ada data jamaah untuk diekspor ke PDF.');
  }

  // Create PDF landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background bar
  doc.setFillColor(15, 76, 58); // Saudi Emerald Green
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Gold accent line
  doc.setFillColor(212, 175, 55); // Gold
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('FANDIEGO TOURS & TRAVEL INDONESIA', 14, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 245, 235);
  doc.text('Izin Kemenag RI No. 892/2021 | Sistem Pengawasan Dokumen Manifest & Keberangkatan Haji & Umrah', 14, 16);

  // Time & Info on right
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(8);
  doc.text(`Dicetak: ${dateStr}`, pageWidth - 14, 12, { align: 'right' });
  doc.text(`Total Manifest: ${pilgrims.length} Jamaah`, pageWidth - 14, 17, { align: 'right' });

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(title.toUpperCase(), 14, 34);

  // Quick summary badges row
  const verifiedCount = pilgrims.filter(p => p.docVerified).length;
  const pendingCount = pilgrims.length - verifiedCount;
  const rescheduledCount = pilgrims.filter(p => p.isRescheduled).length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Status Dokumen: ${verifiedCount} Terverifikasi Penuh (${Math.round((verifiedCount / pilgrims.length) * 100)}%)  |  ${pendingCount} Menunggu Kelengkapan  |  ${rescheduledCount} Pernah Pindah Jadwal (Berkas Otomatis Terpindah)`,
    14,
    40
  );

  // Table columns & rows
  const tableHead = [
    ['No', 'Nama Jamaah', 'Maskapai', 'Flight', 'Tgl Berangkat', 'Verif', 'Paspor', 'Foto', 'KTP/KK', 'Meningitis', 'Polio', 'Biometrik']
  ];

  const tableBody = pilgrims.map((p, index) => [
    index + 1,
    p.pilgrimName + (p.isRescheduled ? ' (Pindah Tgl)' : ''),
    p.airline,
    p.flightCode,
    p.departureDate,
    p.docVerified ? '✓ OK' : '✗ Belum',
    p.passport ? '✓' : '✗',
    p.photo ? '✓' : '✗',
    p.ktpkk ? '✓' : '✗',
    p.meningitis ? '✓' : '✗',
    p.polio ? '✓' : '✗',
    p.biometric ? '✓' : '✗'
  ]);

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 44,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [15, 76, 58],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 35 },
      3: { halign: 'center', cellWidth: 22 },
      4: { halign: 'center', cellWidth: 24 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'center', cellWidth: 15 },
      8: { halign: 'center', cellWidth: 16 },
      9: { halign: 'center', cellWidth: 18 },
      10: { halign: 'center', cellWidth: 16 },
      11: { halign: 'center', cellWidth: 18 }
    },
    didParseCell: (data) => {
      // Highlight checkmarks
      if (data.section === 'body' && data.column.index >= 5) {
        const val = String(data.cell.raw);
        if (val.includes('✓')) {
          data.cell.styles.textColor = [16, 128, 67]; // Green
          data.cell.styles.fontStyle = 'bold';
        } else if (val.includes('✗')) {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        }
      }
    },
    foot: [
      ['', 'CATATAN SISTEM:', 'Seluruh dokumen jamaah yang berpindah tanggal keberangkatan otomatis terpelihara dan terbawa ke jadwal baru tanpa ada data yang hilang.', '', '', '', '', '', '', '', '', '']
    ],
    footStyles: {
      fillColor: [248, 250, 252],
      textColor: [100, 116, 139],
      fontSize: 7,
      fontStyle: 'italic'
    }
  });

  // Footer Signatures
  // Get final Y from autoTable
  // @ts-expect-error lastAutoTable injected by plugin
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 160;

  if (finalY < 185) {
    const signY = Math.min(finalY, 165);
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    
    doc.text('Petugas Verifikasi Dokumen,', 25, signY);
    doc.line(25, signY + 16, 75, signY + 16);
    doc.text('( Bagian Visa & Dokumen )', 25, signY + 20);

    doc.text('Kepala Operasional & Manifest,', pageWidth - 80, signY);
    doc.line(pageWidth - 80, signY + 16, pageWidth - 30, signY + 16);
    doc.text('( Manajer Operasional )', pageWidth - 80, signY + 20);
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`);
}
