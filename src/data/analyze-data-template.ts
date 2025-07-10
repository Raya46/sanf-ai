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
    name: "2. LOI Kerjasama",
    format: "PDF",
    details: "Pihak: PT Bohir Jaya",
    status: "missing",
  },
  {
    id: "rekapan_sales",
    name: "3. Rekapan Sales 3 bulan",
    format: "PDF/Excel",
    details: "Periode: Apr-Jun 2025",
    status: "missing",
  },
  {
    id: "laporan_keuangan",
    name: "4. Laporan Keuangan 2 tahun",
    format: "PDF",
    details: "Periode: 2023-2024",
    status: "missing",
  },
  {
    id: "invoice_proyek",
    name: "5. Invoice Proyek 2 bulan",
    format: "PDF",
    details: "Periode: Apr-Mei 2025",
    status: "missing",
  },
  {
    id: "dokumen_collateral",
    name: "6. Dokumen Collateral",
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

export const applicationTypes = [
  { value: "heavy_equipment", label: "Pembiayaan Alat Berat" },
  { value: "trucking", label: "Trucking" },
  { value: "other", label: "Lain-lain" },
];

export const analysisTemplates: {
  [key: string]: { value: string; label: string }[];
} = {
  heavy_equipment: [
    {
      value: "heavy_equipment_template_1",
      label: "Template Pembiayaan Alat Berat 1",
    },
    {
      value: "heavy_equipment_template_2",
      label: "Template Pembiayaan Alat Berat 2",
    },
  ],
  trucking: [{ value: "trucking_template_1", label: "Template Trucking 1" }],
  other: [{ value: "other_template_1", label: "Template Lain-lain 1" }],
};

export const requiredDocuments: { [key: string]: DocumentRequirement[] } = {
  heavy_equipment_template_1: [
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
};

export const riskParametersData: {
  [key: string]: { [key: string]: string | number };
} = {
  heavy_equipment_template_1: {
    derMaksimal: 3.5,
    quickRatio: 1.2,
    cashRatio: 0.8,
    totalPenjualan: "> Rp5 miliar/tahun",
    usiaPerusahaan: "≥ 2 tahun",
    dscr: "≥ 1.3",
  },
  heavy_equipment_template_2: {
    derMaksimal: 4.0,
    quickRatio: 1.0,
    cashRatio: 0.7,
    totalPenjualan: "> Rp4 miliar/tahun",
    usiaPerusahaan: "≥ 1 tahun",
    dscr: "≥ 1.2",
  },
  trucking_template_1: {
    derMaksimal: 3.0,
    quickRatio: 1.5,
    cashRatio: 1.0,
    totalPenjualan: "> Rp3 miliar/tahun",
    usiaPerusahaan: "≥ 3 tahun",
    dscr: "≥ 1.5",
  },
  other_template_1: {
    derMaksimal: 5.0,
    quickRatio: 0.9,
    cashRatio: 0.6,
    totalPenjualan: "> Rp2 miliar/tahun",
    usiaPerusahaan: "≥ 0.5 tahun",
    dscr: "≥ 1.0",
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
