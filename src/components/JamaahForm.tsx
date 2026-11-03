import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  User, 
  Calendar, 
  CalendarClock, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  FileCheck, 
  BookOpen, 
  Image, 
  IdCard, 
  Syringe, 
  Fingerprint, 
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { Pilgrim, DocumentChecklist } from '../types/jamaah';
import { AIRLINES_LIST } from '../data/airlineData';

interface JamaahFormProps {
  onSave: (data: Omit<Pilgrim, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingPilgrim?: Pilgrim | null;
  onCancelEdit?: () => void;
  onNavigateToReschedule?: () => void;
}

export const JamaahForm: React.FC<JamaahFormProps> = ({
  onSave,
  editingPilgrim,
  onCancelEdit,
  onNavigateToReschedule
}) => {
  // Form State
  const [airline, setAirline] = useState<string>('Saudia Airlines');
  const [flightCode, setFlightCode] = useState<string>('SV 819');
  const [pilgrimName, setPilgrimName] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 7 Checklist Items
  const [docVerified, setDocVerified] = useState<boolean>(false);
  const [passport, setPassport] = useState<boolean>(false);
  const [photo, setPhoto] = useState<boolean>(false);
  const [ktpkk, setKtpkk] = useState<boolean>(false);
  const [meningitis, setMeningitis] = useState<boolean>(false);
  const [polio, setPolio] = useState<boolean>(false);
  const [biometric, setBiometric] = useState<boolean>(false);

  // Set today or tomorrow as default departure date if empty
  useEffect(() => {
    if (!editingPilgrim && !departureDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 14);
      setDepartureDate(tomorrow.toISOString().slice(0, 10));
    }
  }, [editingPilgrim, departureDate]);

  // When editing pilgrim changes, populate form
  useEffect(() => {
    if (editingPilgrim) {
      setAirline(editingPilgrim.airline);
      setFlightCode(editingPilgrim.flightCode);
      setPilgrimName(editingPilgrim.pilgrimName);
      setDepartureDate(editingPilgrim.departureDate);
      setPassportNumber(editingPilgrim.passportNumber || '');
      setPhoneNumber(editingPilgrim.phoneNumber || '');
      setCity(editingPilgrim.city || '');
      setNotes(editingPilgrim.notes || '');

      setDocVerified(editingPilgrim.docVerified);
      setPassport(editingPilgrim.passport);
      setPhoto(editingPilgrim.photo);
      setKtpkk(editingPilgrim.ktpkk);
      setMeningitis(editingPilgrim.meningitis);
      setPolio(editingPilgrim.polio);
      setBiometric(editingPilgrim.biometric);
    } else {
      resetForm();
    }
  }, [editingPilgrim]);

  // Handle airline selection change and suggest first flight code
  const handleAirlineChange = (selectedAirlineName: string) => {
    setAirline(selectedAirlineName);
    const found = AIRLINES_LIST.find(a => a.name === selectedAirlineName);
    if (found && found.commonFlights.length > 0) {
      setFlightCode(found.commonFlights[0]);
    }
  };

  const selectedAirlineObj = AIRLINES_LIST.find(a => a.name === airline);

  // Quick select all checklists
  const toggleSelectAllDocuments = (value: boolean) => {
    setDocVerified(value);
    setPassport(value);
    setPhoto(value);
    setKtpkk(value);
    setMeningitis(value);
    setPolio(value);
    setBiometric(value);
  };

  // If all 6 sub-documents are checked, automatically check docVerified
  const handleIndividualCheck = (key: keyof DocumentChecklist, checked: boolean) => {
    const updated = {
      docVerified,
      passport,
      photo,
      ktpkk,
      meningitis,
      polio,
      biometric,
      [key]: checked
    };

    if (key === 'passport') setPassport(checked);
    if (key === 'photo') setPhoto(checked);
    if (key === 'ktpkk') setKtpkk(checked);
    if (key === 'meningitis') setMeningitis(checked);
    if (key === 'polio') setPolio(checked);
    if (key === 'biometric') setBiometric(checked);
    if (key === 'docVerified') setDocVerified(checked);

    // Auto-sync: if all 6 supporting documents are true, suggest/set docVerified true
    if (key !== 'docVerified') {
      const allSupportingOk = 
        (key === 'passport' ? checked : passport) &&
        (key === 'photo' ? checked : photo) &&
        (key === 'ktpkk' ? checked : ktpkk) &&
        (key === 'meningitis' ? checked : meningitis) &&
        (key === 'polio' ? checked : polio) &&
        (key === 'biometric' ? checked : biometric);
      
      if (allSupportingOk) {
        setDocVerified(true);
      }
    }
  };

  const resetForm = () => {
    setAirline('Saudia Airlines');
    setFlightCode('SV 819');
    setPilgrimName('');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    setDepartureDate(tomorrow.toISOString().slice(0, 10));
    setPassportNumber('');
    setPhoneNumber('');
    setCity('');
    setNotes('');

    setDocVerified(false);
    setPassport(false);
    setPhoto(false);
    setKtpkk(false);
    setMeningitis(false);
    setPolio(false);
    setBiometric(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pilgrimName.trim()) {
      alert('Mohon isi nama lengkap jamaah sesuai paspor.');
      return;
    }

    if (!airline) {
      alert('Mohon pilih maskapai penerbangan.');
      return;
    }

    if (!flightCode.trim()) {
      alert('Mohon isi kode penerbangan (Flight Code).');
      return;
    }

    if (!departureDate) {
      alert('Mohon tentukan tanggal keberangkatan.');
      return;
    }

    // Submit payload
    const pilgrimData: Omit<Pilgrim, 'id' | 'createdAt' | 'updatedAt'> = {
      airline,
      flightCode,
      pilgrimName: pilgrimName.trim(),
      departureDate,
      passportNumber: passportNumber.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      city: city.trim() || undefined,
      notes: notes.trim() || undefined,
      docVerified,
      passport,
      photo,
      ktpkk,
      meningitis,
      polio,
      biometric
    };

    onSave(pilgrimData);
    
    if (!editingPilgrim) {
      resetForm();
    }
  };

  const isAllChecked = docVerified && passport && photo && ktpkk && meningitis && polio && biometric;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-7">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">
              {editingPilgrim ? 'Edit Data Jamaah & Reschedule' : 'Form Input Verifikasi Dokumen Jamaah'}
            </h3>
            {editingPilgrim && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                Mode Edit #{editingPilgrim.id}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Input maskapai internasional, kode flight, tanggal keberangkatan, dan status verifikasi 7 dokumen.
          </p>
        </div>

        {editingPilgrim && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition self-start sm:self-center"
          >
            Batal Mode Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-7">
        {/* SECTION 1: FLIGHT & IDENTITAS JAMAAH */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-emerald-600" />
            1. Penerbangan & Data Jamaah
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Maskapai Internasional */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Maskapai Penerbangan Internasional <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={airline}
                  onChange={(e) => handleAirlineChange(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                >
                  <optgroup label="Maskapai Utama (Priority / Saudi Direct)">
                    <option value="Saudia Airlines">Saudia Airlines (SV - Arab Saudi)</option>
                    <option value="Garuda Indonesia">Garuda Indonesia (GA - Indonesia)</option>
                    <option value="Flynas">Flynas (XY - Arab Saudi)</option>
                  </optgroup>
                  <optgroup label="Maskapai Internasional Lainnya (Transit / Direct)">
                    {AIRLINES_LIST.filter(a => !['Saudia Airlines', 'Garuda Indonesia', 'Flynas'].includes(a.name)).map(a => (
                      <option key={a.code} value={a.name}>
                        {a.name} ({a.code} - {a.country})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pilih maskapai untuk rute Jeddah (JED) atau Madinah (MED)
              </p>
            </div>

            {/* Flight Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Penerbangan (Flight Code) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={flightCode}
                onChange={(e) => setFlightCode(e.target.value.toUpperCase())}
                placeholder="Contoh: SV 819 / GA 980"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-wider text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
              {/* Quick suggestions chips */}
              {selectedAirlineObj && selectedAirlineObj.commonFlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-slate-400 self-center mr-0.5">Saran:</span>
                  {selectedAirlineObj.commonFlights.slice(0, 4).map(code => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setFlightCode(code)}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition ${
                        flightCode === code 
                          ? 'bg-emerald-600 text-white font-bold' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nama Jamaah */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Jamaah Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pilgrimName}
                  onChange={(e) => setPilgrimName(e.target.value)}
                  placeholder="Contoh: Ahmad Zainuddin Mansur"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Harus persis sama dengan nama di paspor (min 2 atau 3 kata)
              </p>
            </div>

            {/* Tanggal Keberangkatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Keberangkatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
            </div>

            {/* Nomor Paspor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Paspor (Opsional)
              </label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                placeholder="Contoh: B9182341"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm uppercase tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
            </div>

            {/* Nomor Telp / Kota */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0812-xxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kota Domisili
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jakarta / Solo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHECKLIST 7 DOKUMEN KELENGKAPAN */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                2. Verifikasi 7 Dokumen Kelengkapan
              </h4>
              <p className="text-xs text-slate-500">
                Centang setiap berkas yang sudah diterima, divalidasi, dan diarsipkan.
              </p>
            </div>

            {/* Quick check/uncheck all */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => toggleSelectAllDocuments(true)}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold border border-emerald-200 transition"
              >
                ✓ Centang Semua
              </button>
              <button
                type="button"
                onClick={() => toggleSelectAllDocuments(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition"
              >
                Batal Centang
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-2">
            {/* 1. Dokumen Terverifikasi Utama */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              docVerified 
                ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={docVerified}
                onChange={(e) => handleIndividualCheck('docVerified', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Dok. Terverifikasi
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Status verifikasi global manifest
                </span>
              </div>
            </label>

            {/* 2. Pasport */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              passport 
                ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={passport}
                onChange={(e) => handleIndividualCheck('passport', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Paspor (Asli)
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Masa berlaku min 6 bulan
                </span>
              </div>
            </label>

            {/* 3. Pass Foto */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              photo 
                ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={photo}
                onChange={(e) => handleIndividualCheck('photo', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Pass Foto (4x6)
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Latar putih, fokus wajah 80%
                </span>
              </div>
            </label>

            {/* 4. KTP & KK */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              ktpkk 
                ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={ktpkk}
                onChange={(e) => handleIndividualCheck('ktpkk', e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  KTP & Kartu Keluarga
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Fotokopi legalisir & asli
                </span>
              </div>
            </label>

            {/* 5. Vaksin Meningitis */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              meningitis 
                ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={meningitis}
                onChange={(e) => handleIndividualCheck('meningitis', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Vaksin Meningitis
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Buku kuning ICV / SatuSehat
                </span>
              </div>
            </label>

            {/* 6. Vaksin Polio */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none ${
              polio 
                ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={polio}
                onChange={(e) => handleIndividualCheck('polio', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 mt-0.5"
              />
              <div className="ml-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Vaksin Polio
                </span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Sertifikat nOPV2 resmi
                </span>
              </div>
            </label>

            {/* 7. Biometrik */}
            <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition select-none sm:col-span-2 lg:col-span-2 ${
              biometric 
                ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400/40' 
                : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={biometric}
                onChange={(e) => handleIndividualCheck('biometric', e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
              />
              <div className="ml-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Biometrik (Bio Visa KSA)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-semibold">
                    Wajib Saudi
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Perekaman sidik jari & scan retina melalui aplikasi Saudi Visa Bio
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* INFO PEMISAHAN MENU: RESCHEDULE / PINDAH TANGGAL TERPISAH */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800 block">
                Ingin Memindahkan Tanggal Keberangkatan (Reschedule)?
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Fitur pindah tanggal kini berada di menu khusus <strong>Pindah Tanggal (Reschedule)</strong>. Sistem secara otomatis menjamin seluruh 7 dokumen (Paspor, Foto, KTP/KK, Vaksin Meningitis, Polio, Biometrik) akan ikut terpindah ke jadwal baru.
              </p>
            </div>
          </div>

          {onNavigateToReschedule && (
            <button
              type="button"
              onClick={onNavigateToReschedule}
              className="px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition shrink-0 self-start sm:self-center"
            >
              Buka Menu Pindah Tanggal →
            </button>
          )}
        </div>

        {/* Notes umum */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Catatan Tambahan Jamaah (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Kebutuhan khusus (kursi roda, makanan vegetarian, kamar double/triple/quad)..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Form
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingPilgrim ? 'Simpan Perubahan Data' : 'Simpan & Daftarkan Jamaah'}
          </button>
        </div>
      </form>
    </div>
  );
};
