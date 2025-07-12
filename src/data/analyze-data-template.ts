import { DocumentRequirement } from "@/type/step-type";

export const initialDocuments: DocumentRequirement[] = [
  {
    id: "rekening_koran",
    name: "Rekening Koran 3 bulan",
    format: "PDF",
    details: "Periode: Apr-Jun 2025",
    status: "missing",
  },
  {
    id: "loi_kerjasama",
    name: "LOI Kerjasama",
    format: "PDF",
    details: "Pihak: PT Bohir Jaya",
    status: "missing",
  },
  {
    id: "rekapan_sales",
    name: "Rekapan Sales 3 bulan",
    format: "PDF/Excel",
    details: "Periode: Apr-Jun 2025",
    status: "missing",
  },
  {
    id: "laporan_keuangan",
    name: "Laporan Keuangan 2 tahun",
    format: "PDF",
    details: "Periode: 2023-2024",
    status: "missing",
  },
  {
    id: "invoice_proyek",
    name: "Invoice Proyek 2 bulan",
    format: "PDF",
    details: "Periode: Apr-Mei 2025",
    status: "missing",
  },
  {
    id: "dokumen_collateral",
    name: "Dokumen Collateral",
    format: "PDF",
    details: "Detail: Sertifikat tanah sebagai jaminan",
    status: "missing",
  },
  {
    id: "legalitas_usaha",
    name: "Legalitas Usaha",
    format: "PDF",
    details: "Dokumen: KTP, NPWP, Akta, NIB, SK Menkeu",
    status: "missing",
  },
  {
    id: "company_profile",
    name: "Company Profile",
    format: "PDF",
    details: "Detail: Profil perusahaan lengkap",
    status: "missing",
  },
];

// Data untuk seleksi dropdown
export const applicationTypes = [
  { value: "leasing", label: "Pembiayaan Leasing" },
  { value: "modal_kerja", label: "Pembiayaan Modal Kerja" },
  { value: "multiguna", label: "Pembiayaan Multiguna" },
];

export const analysisTemplates: {
  [key: string]: { value: string; label: string }[];
} = {
  leasing: [
    { value: "alat_berat", label: "Pembiayaan Alat Berat" },
    { value: "mesin_industri", label: "Pembiayaan Mesin Industri" },
    {
      value: "kendaraan_operasional",
      label: "Pembiayaan Kendaraan Operasional",
    },
  ],
  modal_kerja: [
    { value: "factoring", label: "Factoring (Anjak Piutang)" },
    { value: "invoice_financing", label: "Invoice Financing" },
  ],
  multiguna: [
    { value: "kendaraan_bermotor", label: "Pembiayaan Kendaraan Bermotor" },
  ],
};

// PERBAIKAN: Mock data diperluas untuk mencakup semua template
export const requiredDocuments: { [key: string]: DocumentRequirement[] } = {
  alat_berat: [
    {
      id: "rekening_koran",
      name: "Rekening Koran 3 bulan",
      format: "PDF",
      details: "Periode: Apr-Jun 2025",
      status: "missing",
    },
    {
      id: "loi_kerjasama",
      name: "LOI Kerjasama",
      format: "PDF",
      details: "Pihak: PT Bohir Jaya",
      status: "missing",
    },
    {
      id: "rekapan_sales",
      name: "Rekapan Sales 3 bulan",
      format: "PDF/Excel",
      details: "Periode: Apr-Jun 2025",
      status: "missing",
    },
    {
      id: "laporan_keuangan",
      name: "Laporan Keuangan 2 tahun",
      format: "PDF",
      details: "Periode: 2023-2024",
      status: "missing",
    },
    {
      id: "invoice_proyek",
      name: "Invoice Proyek 2 bulan",
      format: "PDF",
      details: "Periode: Apr-Mei 2025",
      status: "missing",
    },
    {
      id: "dokumen_collateral",
      name: "Dokumen Collateral",
      format: "PDF",
      details: "Detail: Sertifikat tanah sebagai jaminan",
      status: "missing",
    },
    {
      id: "legalitas_usaha",
      name: "Legalitas Usaha",
      format: "PDF",
      details: "Dokumen: KTP, NPWP, Akta, NIB, SK Menkeu",
      status: "missing",
    },
    {
      id: "company_profile",
      name: "Company Profile",
      format: "PDF",
      details: "Detail: Profil perusahaan lengkap",
      status: "missing",
    },
  ],
  mesin_industri: [
    {
      id: "rekening_koran_6bln",
      name: "Rekening Koran 6 bulan",
      format: "PDF",
      details: "Periode: Jan-Jun 2025",
      status: "missing",
    },
    {
      id: "company_profile",
      name: "Company Profile",
      format: "PDF",
      details: "Profil perusahaan lengkap",
      status: "missing",
    },
    {
      id: "penawaran_mesin",
      name: "Penawaran Harga Mesin",
      format: "PDF",
      details: "Dari supplier resmi",
      status: "missing",
    },
  ],
  kendaraan_operasional: [
    {
      id: "stnk_bpkb",
      name: "STNK & BPKB Kendaraan",
      format: "PDF",
      details: "Untuk semua unit yang dibiayai",
      status: "missing",
    },
    {
      id: "invoice_pembelian",
      name: "Invoice Pembelian Kendaraan",
      format: "PDF",
      details: "Dari dealer resmi",
      status: "missing",
    },
    {
      id: "rekening_koran_3bln",
      name: "Rekening Koran 3 bulan",
      format: "PDF",
      details: "Periode terakhir",
      status: "missing",
    },
  ],
  factoring: [
    {
      id: "daftar_piutang",
      name: "Daftar Piutang Usaha",
      format: "Excel/PDF",
      details: "Daftar piutang yang akan dijaminkan",
      status: "missing",
    },
    {
      id: "legalitas_usaha",
      name: "Legalitas Usaha",
      format: "PDF",
      details: "KTP, NPWP, Akta, NIB",
      status: "missing",
    },
    {
      id: "invoice_terkait",
      name: "Contoh Invoice Terkait",
      format: "PDF",
      details: "Minimal 3 contoh invoice",
      status: "missing",
    },
  ],
  invoice_financing: [
    {
      id: "invoice_akan_dibiayai",
      name: "Invoice yang Akan Dibiayai",
      format: "PDF",
      details: "Invoice yang valid dan belum jatuh tempo",
      status: "missing",
    },
    {
      id: "rekening_koran_3bln",
      name: "Rekening Koran 3 bulan",
      format: "PDF",
      details: "Periode terakhir",
      status: "missing",
    },
  ],
  kendaraan_bermotor: [
    {
      id: "ktp_kk",
      name: "KTP & Kartu Keluarga",
      format: "PDF/JPEG",
      details: "Pemohon dan penjamin (jika ada)",
      status: "missing",
    },
    {
      id: "slip_gaji",
      name: "Slip Gaji / Bukti Penghasilan",
      format: "PDF",
      details: "3 bulan terakhir",
      status: "missing",
    },
    {
      id: "rekening_tabungan",
      name: "Rekening Tabungan",
      format: "PDF",
      details: "3 bulan terakhir",
      status: "missing",
    },
  ],
};

export const riskParametersData: {
  [key: string]: { [key: string]: string | number };
} = {
  alat_berat: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
  mesin_industri: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
  kendaraan_operasional: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
  factoring: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
  invoice_financing: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
  kendaraan_bermotor: {
    der: 0.9,
    dscr: "≥ 2.1",
    cashRatio: 0.44,
    quickRatio: 1.12,
    debtToAsset: 47.3,
    currentRatio: 1.43,
    interestCoverage: 5.79,
    cashFlowOperation: 30,
  },
};

export const businessFields = [
  { value: "pertambangan", label: "Pertambangan" },
  { value: "manufaktur", label: "Manufaktur" },
  { value: "jasa", label: "Jasa" },
  { value: "perdagangan", label: "Perdagangan" },
  { value: "konstruksi", label: "Konstruksi" },
  { value: "transportasi", label: "Transportasi" },
  { value: "lainnya", label: "Lainnya" },
];

export const promptSuggestions = [
  {
    id: "saran1",
    label:
      "Analisis kemampuan pembayaran berdasarkan rasio keuangan historis dan proyeksi cashflow.",
  },
  {
    id: "saran2",
    label:
      "Verifikasi kesesuaian invoice dengan rekening koran dan proyeksi pendapatan.",
  },
  {
    id: "saran3",
    label:
      "Fokus pada validitas kerjasama dengan pihak ketiga dan periksa risiko konsentrasi pelanggan.",
  },
];
