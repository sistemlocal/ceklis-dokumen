export interface DocumentChecklist {
  docVerified: boolean; // Dokumen Utama Terverifikasi
  passport: boolean;    // Paspor
  photo: boolean;       // Pass Foto 4x6 latar putih 80% wajah
  ktpkk: boolean;       // KTP & KK
  meningitis: boolean;  // Vaksin Meningitis
  polio: boolean;       // Vaksin Polio
  biometric: boolean;   // Biometrik (Bio Visa)
}

export interface Pilgrim extends DocumentChecklist {
  id: string;
  pilgrimName: string;
  airline: string;
  flightCode: string;
  departureDate: string; // YYYY-MM-DD
  passportNumber?: string;
  phoneNumber?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isRescheduled?: boolean;
  rescheduleHistory?: RescheduleHistoryItem[];
}

export interface RescheduleHistoryItem {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  oldDate: string;
  newDate: string;
  oldFlightCode?: string;
  newFlightCode?: string;
  rescheduledAt: string;
  notes?: string;
  documentsCarriedOver: DocumentChecklist;
}

export interface AirlineOption {
  name: string;
  code: string;
  country: string;
  commonFlights: string[];
  badgeColor: string;
}
