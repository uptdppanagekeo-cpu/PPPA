/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  BarChart2,
  PhoneCall,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Download,
  Eye,
  Trash2,
  UserCheck,
  Building,
  HeartHandshake,
  FileSpreadsheet,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Send,
  RefreshCw,
  X
} from 'lucide-react';

// Types
interface CaseItem {
  id: string;
  regNumber: string;
  dateReported: string;
  victimName: string;
  victimAge: number;
  victimGender: 'Perempuan' | 'Laki-laki';
  category: 'Anak (<18 Thn)' | 'Perempuan Dewasa';
  kecamatan: string;
  desa: string;
  violenceType: 'Fisik' | 'Psikis' | 'Seksual' | 'Penelantaran' | 'Eksploitasi' | 'TPPO';
  perpetratorRelation: string;
  status: 'Laporan Masuk' | 'Verifikasi & Triage' | 'Proses Pendampingan' | 'Rujukan' | 'Selesai';
  urgency: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
  servicesProvided: string[];
  officerInCharge: string;
  chronology: string;
  notes: string;
}

const NAGEKEO_KECAMATAN = [
  'Aesesa (Mbay)',
  'Boawae',
  'Mauponggo',
  'Nangaroro',
  'Keo Tengah',
  'Aesesa Selatan',
  'Wolowae',
  'Suru Mbu',
  'Lainnya'
];

const INITIAL_CASES: CaseItem[] = [
  {
    id: '1',
    regNumber: 'REG-2026/NGK-001',
    dateReported: '2026-10-12',
    victimName: 'M. W.',
    victimAge: 14,
    victimGender: 'Perempuan',
    category: 'Anak (<18 Thn)',
    kecamatan: 'Aesesa (Mbay)',
    desa: 'Danga',
    violenceType: 'Psikis',
    perpetratorRelation: 'Keluarga Dekat / Paman',
    status: 'Proses Pendampingan',
    urgency: 'Tinggi',
    servicesProvided: ['Konseling Psikologi', 'Pendampingan Hukum'],
    officerInCharge: 'Maria Goreti, S.Psi',
    chronology: 'Korban mengalami tekanan mental dan ancaman di lingkungan keluarga. Dilaporkan oleh pihak sekolah ke UPTD PPA.',
    notes: 'Sesi konseling tahap ke-2 dijadwalkan minggu ini bersama psikolog klinis.'
  },
  {
    id: '2',
    regNumber: 'REG-2026/NGK-002',
    dateReported: '2026-10-15',
    victimName: 'Y. D.',
    victimAge: 27,
    victimGender: 'Perempuan',
    category: 'Perempuan Dewasa',
    kecamatan: 'Boawae',
    desa: 'Boawae',
    violenceType: 'Fisik',
    perpetratorRelation: 'Suami Sah',
    status: 'Verifikasi & Triage',
    urgency: 'Darurat',
    servicesProvided: ['Layanan Medis / Visum', 'Rumah Aman (Shelter)'],
    officerInCharge: 'Yohanes Ngga, S.H.',
    chronology: 'Terjadi kekerasan dalam rumah tangga (KDRT) fisik akibat perselisihan ekonomi.',
    notes: 'Korban telah dievakuasi ke shelter sementara dan didampingi untuk visum et repertum di RSUD Mbay.'
  },
  {
    id: '3',
    regNumber: 'REG-2026/NGK-003',
    dateReported: '2026-10-18',
    victimName: 'A. K.',
    victimAge: 9,
    victimGender: 'Laki-laki',
    category: 'Anak (<18 Thn)',
    kecamatan: 'Mauponggo',
    desa: 'Mauponggo',
    violenceType: 'Penelantaran',
    perpetratorRelation: 'Orang Tua Kandung',
    status: 'Selesai',
    urgency: 'Sedang',
    servicesProvided: ['Mediasi Keluarga', 'Bantuan Sosial'],
    officerInCharge: 'Agustina Watu, A.Md.Keb',
    chronology: 'Anak ditinggal tanpa pengawasan memadai dan kurang mendapatkan hak pendidikan serta pengasuhan.',
    notes: 'Telah dilakukan mediasi dengan kerabat dan pemantauan rutin oleh pekerja sosial desa.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cases' | 'new-case' | 'ai-assistant' | 'directory'>('dashboard');
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Modal Detail Kasus
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  // Form Input Kasus Baru state
  const [newRegNumber, setNewRegNumber] = useState(`REG-2026/NGK-00${cases.length + 1}`);
  const [newDateReported, setNewDateReported] = useState(new Date().toISOString().split('T')[0]);
  const [newVictimName, setNewVictimName] = useState('');
  const [newVictimAge, setNewVictimAge] = useState(15);
  const [newVictimGender, setNewVictimGender] = useState<'Perempuan' | 'Laki-laki'>('Perempuan');
  const [newCategory, setNewCategory] = useState<'Anak (<18 Thn)' | 'Perempuan Dewasa'>('Anak (<18 Thn)');
  const [newKecamatan, setNewKecamatan] = useState('Aesesa (Mbay)');
  const [newDesa, setNewDesa] = useState('');
  const [newViolenceType, setNewViolenceType] = useState<'Fisik' | 'Psikis' | 'Seksual' | 'Penelantaran' | 'Eksploitasi' | 'TPPO'>('Fisik');
  const [newPerpetratorRelation, setNewPerpetratorRelation] = useState('');
  const [newUrgency, setNewUrgency] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat'>('Sedang');
  const [newOfficer, setNewOfficer] = useState('');
  const [newChronology, setNewChronology] = useState('');
  const [newServices, setNewServices] = useState<string[]>(['Konseling Psikologi']);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCaseForAI, setSelectedCaseForAI] = useState<CaseItem | null>(cases[0] || null);

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.victimName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.desa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKecamatan = filterKecamatan === 'Semua' || c.kecamatan === filterKecamatan;
    const matchesType = filterType === 'Semua' || c.violenceType === filterType;
    const matchesStatus = filterStatus === 'Semua' || c.status === filterStatus;
    return matchesSearch && matchesKecamatan && matchesType && matchesStatus;
  });

  // Handle Add Case
  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVictimName || !newDesa || !newChronology) {
      alert('Mohon lengkapi data korban, desa, dan kronologi kasus.');
      return;
    }

    const newCaseItem: CaseItem = {
      id: String(cases.length + 1),
      regNumber: newRegNumber,
      dateReported: newDateReported,
      victimName: newVictimName,
      victimAge: Number(newVictimAge),
      victimGender: newVictimGender,
      category: newCategory,
      kecamatan: newKecamatan,
      desa: newDesa,
      violenceType: newViolenceType,
      perpetratorRelation: newPerpetratorRelation || 'Tidak diketahui',
      status: 'Laporan Masuk',
      urgency: newUrgency,
      servicesProvided: newServices,
      officerInCharge: newOfficer || 'Tim UPTD PPA Nagekeo',
      chronology: newChronology,
      notes: 'Laporan baru dicatat dalam sistem SIMP-PPA.'
    };

    setCases([newCaseItem, ...cases]);
    alert(`Kasus baru berhasil dicatat dengan nomor registrasi: ${newRegNumber}`);
    setActiveTab('cases');
    // Reset form
    setNewVictimName('');
    setNewDesa('');
    setNewChronology('');
    setNewRegNumber(`REG-2026/NGK-00${cases.length + 2}`);
  };

  // Call Gemini AI API via backend proxy
  const handleAskAI = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim()) return;

    setAiLoading(true);
    setAiResponse('');

    try {
      const systemInstruction = `Anda adalah Asisten Ahli Hukum dan Pekerja Sosial profesional di UPTD PPA (Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak) Kabupaten Nagekeo, Nusa Tenggara Timur. Tugas Anda adalah memberikan analisis kasus yang objektif, berperspektif korban, mengacu pada UU PKDRT, UU Perlindungan Anak, atau UU TPPO di Indonesia, serta menyarankan langkah-langkah intervensi dan draf laporan resmi yang santun, empatik, dan akurat secara hukum.`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend, systemInstruction })
      });

      const data = await res.json();
      if (data.error) {
        setAiResponse(`Error: ${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err: any) {
      setAiResponse(`Gagal terhubung ke server AI: ${err.message || 'Unknown error'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiAnalyzeCase = (caseItem: CaseItem) => {
    setSelectedCaseForAI(caseItem);
    setActiveTab('ai-assistant');
    const prompt = `Lakukan analisis komprehensif dan berikan rekomendasi rencana penanganan untuk kasus berikut yang ditangani oleh UPTD PPA Kabupaten Nagekeo:
- Nomor Registrasi: ${caseItem.regNumber}
- Kategori Korban: ${caseItem.category} (${caseItem.victimGender}, ${caseItem.victimAge} tahun)
- Lokasi: ${caseItem.desa}, Kecamatan ${caseItem.kecamatan}
- Jenis Kekerasan: ${caseItem.violenceType}
- Hubungan Pelaku: ${caseItem.perpetratorRelation}
- Tingkat Urgensi: ${caseItem.urgency}
- Kronologi: ${caseItem.chronology}

Mohon berikan:
1. Analisis Risiko & Kebutuhan Pendampingan (Hukum, Medis, Psikososial)
2. Rujukan instansi terkait di Kabupaten Nagekeo (misalnya RSUD Mbay, Polres Nagekeo, Dinas Sosial)
3. Draf rekomendasi langkah operasional bagi petugas UPTD PPA.`;

    setAiPrompt(prompt);
    handleAskAI(prompt);
  };

  // Statistics calculations
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== 'Selesai').length;
  const completedCases = cases.filter(c => c.status === 'Selesai').length;
  const childrenCases = cases.filter(c => c.category === 'Anak (<18 Thn)').length;
  const womenCases = cases.filter(c => c.category === 'Perempuan Dewasa').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                SIMP-PPA Nagekeo
              </h1>
              <p className="text-xs text-slate-500 font-medium">UPTD PPA Kabupaten Nagekeo</p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'dashboard' ? 'border-teal-700 text-teal-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Beranda & Statistik
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'cases' ? 'border-teal-700 text-teal-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Data Kasus
            </button>
            <button
              onClick={() => setActiveTab('new-case')}
              className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'new-case' ? 'border-teal-700 text-teal-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Pencatatan Kasus
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'ai-assistant' ? 'border-teal-700 text-teal-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Analisis AI & Laporan</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'directory' ? 'border-teal-700 text-teal-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Direktori & Rujukan
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('new-case')}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Catat Kasus Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8">
                <Shield className="w-96 h-96" />
              </div>
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/60 text-teal-100 text-xs font-medium">
                  <Building className="w-3.5 h-3.5" />
                  <span>Dinas P2KBP3A Kabupaten Nagekeo, NTT</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Layanan Perlindungan Perempuan & Anak
                </h2>
                <p className="text-teal-100 text-sm leading-relaxed">
                  Pusat layanan terpadu penanganan kasus kekerasan, pengaduan masyarakat, pendampingan hukum, medis, dan psikososial di wilayah Kabupaten Nagekeo.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('new-case')}
                    className="px-5 py-2.5 bg-white text-teal-900 font-semibold rounded-xl text-xs hover:bg-teal-50 transition-colors shadow-sm"
                  >
                    Mulai Pencatatan Kasus
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className="px-5 py-2.5 bg-teal-700/80 text-white font-semibold rounded-xl text-xs hover:bg-teal-700 transition-colors border border-teal-600 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Konsul Asisten AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kasus Tercatat</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{totalCases}</h3>
                  <p className="text-xs text-teal-700 font-medium mt-1">Tahun Anggaran 2026</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kasus Aktif / Proses</p>
                  <h3 className="text-3xl font-bold text-amber-600 mt-1 tabular-nums">{activeCases}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Dalam pendampingan</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kasus Selesai</p>
                  <h3 className="text-3xl font-bold text-emerald-600 mt-1 tabular-nums">{completedCases}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Tuntas & terselesaikan</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Korban Anak & Wanita</p>
                  <h3 className="text-3xl font-bold text-indigo-600 mt-1 tabular-nums">{childrenCases + womenCases}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{childrenCases} Anak · {womenCases} Dewasa</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Cases Quick Table & District Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Kasus Terbaru Masuk</h3>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cases.slice(0, 4).map(c => (
                    <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-teal-800">{c.regNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-xs text-slate-500">{c.dateReported}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {c.victimName} ({c.victimAge} thn, {c.victimGender}) - {c.violenceType}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Kec. {c.kecamatan}, Desa {c.desa}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                          c.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                          c.status === 'Proses Pendampingan' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {c.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCase(c);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District breakdown sidebar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Sebaran Wilayah (Kecamatan)</h3>
                <p className="text-xs text-slate-500">Distribusi laporan per kecamatan di Kabupaten Nagekeo.</p>

                <div className="space-y-3 pt-2">
                  {['Aesesa (Mbay)', 'Boawae', 'Mauponggo', 'Nangaroro', 'Keo Tengah'].map(kec => {
                    const count = cases.filter(c => c.kecamatan === kec).length;
                    const percentage = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
                    return (
                      <div key={kec} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                          <span>{kec}</span>
                          <span className="tabular-nums font-semibold">{count} Kasus</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-teal-700 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="bg-teal-50 rounded-xl p-4 text-xs text-teal-900 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-teal-700" />
                      <span>Hotline Pengaduan 24 Jam UPTD PPA</span>
                    </p>
                    <p className="text-teal-800 font-mono font-bold text-sm">0812-3456-7890 (Mbay)</p>
                    <p className="text-[11px] text-teal-700">Layanan pengaduan cepat, kerahasiaan korban dijamin undang-undang.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CASES LIST */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Data Kasus Kekerasan</h2>
                <p className="text-xs text-slate-500 mt-1">Daftar lengkap pencatatan kasus perempuan dan anak di Kabupaten Nagekeo.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," +
                      ["No.Reg,Tanggal,Korban,Usia,Kecamatan,Jenis Kekerasan,Status,Petugas"].join(",") + "\n" +
                      cases.map(c => `"${c.regNumber}","${c.dateReported}","${c.victimName}",${c.victimAge},"${c.kecamatan}","${c.violenceType}","${c.status}","${c.officerInCharge}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "laporan_kasus_uptd_ppa_nagekeo.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={() => setActiveTab('new-case')}
                  className="px-4 py-2 bg-teal-800 text-white text-xs font-semibold rounded-lg hover:bg-teal-900 flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Kasus</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama korban, no. registrasi, atau desa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={filterKecamatan}
                  onChange={(e) => setFilterKecamatan(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Semua">Semua Kecamatan</option>
                  {NAGEKEO_KECAMATAN.map(kec => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Semua">Semua Jenis Kasus</option>
                  <option value="Fisik">Fisik</option>
                  <option value="Psikis">Psikis</option>
                  <option value="Seksual">Seksual</option>
                  <option value="Penelantaran">Penelantaran</option>
                  <option value="Eksploitasi">Eksploitasi</option>
                  <option value="TPPO">TPPO</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Laporan Masuk">Laporan Masuk</option>
                  <option value="Verifikasi & Triage">Verifikasi & Triage</option>
                  <option value="Proses Pendampingan">Proses Pendampingan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            {/* Table of Cases */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-4">No. Registrasi</th>
                      <th className="py-3.5 px-4">Tanggal</th>
                      <th className="py-3.5 px-4">Korban & Kategori</th>
                      <th className="py-3.5 px-4">Wilayah</th>
                      <th className="py-3.5 px-4">Jenis Kekerasan</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          Tidak ada data kasus yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredCases.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-teal-800">{c.regNumber}</td>
                          <td className="py-3.5 px-4 text-slate-600 tabular-nums">{c.dateReported}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{c.victimName}</div>
                            <div className="text-[11px] text-slate-500">{c.category} · {c.victimAge} thn ({c.victimGender})</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>Kec. {c.kecamatan}</div>
                            <div className="text-[11px] text-slate-400">Desa {c.desa}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                              {c.violenceType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md font-medium ${
                              c.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                              c.status === 'Proses Pendampingan' ? 'bg-amber-50 text-amber-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <button
                              onClick={() => setSelectedCase(c)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                            <button
                              onClick={() => handleAiAnalyzeCase(c)}
                              className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg transition-colors font-medium inline-flex items-center gap-1"
                              title="Analisis AI & Rekomendasi"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NEW CASE FORM */}
        {activeTab === 'new-case' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Pencatatan Kasus Baru UPTD PPA</h2>
              <p className="text-xs text-slate-500 mt-1">Formulir penerimaan laporan pengaduan kasus kekerasan terhadap perempuan dan anak di Kabupaten Nagekeo.</p>
            </div>

            <form onSubmit={handleAddCase} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Registrasi Kasus</label>
                  <input
                    type="text"
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-teal-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Laporan</label>
                  <input
                    type="date"
                    value={newDateReported}
                    onChange={(e) => setNewDateReported(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Inisial / Korban</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sdri. M. A."
                    value={newVictimName}
                    onChange={(e) => setNewVictimName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Usia (Tahun)</label>
                    <input
                      type="number"
                      value={newVictimAge}
                      onChange={(e) => setNewVictimAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      min={1}
                      max={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                    <select
                      value={newVictimGender}
                      onChange={(e) => {
                        const gender = e.target.value as 'Perempuan' | 'Laki-laki';
                        setNewVictimGender(gender);
                        if (gender === 'Laki-laki' && newVictimAge < 18) {
                          setNewCategory('Anak (<18 Thn)');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Perempuan">Perempuan</option>
                      <option value="Laki-laki">Laki-laki</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Korban</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Anak (<18 Thn)">Anak (&lt;18 Tahun)</option>
                    <option value="Perempuan Dewasa">Perempuan Dewasa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan di Nagekeo</label>
                  <select
                    value={newKecamatan}
                    onChange={(e) => setNewKecamatan(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {NAGEKEO_KECAMATAN.map(kec => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Desa / Kelurahan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kelurahan Danga / Mbay"
                    value={newDesa}
                    onChange={(e) => setNewDesa(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kekerasan</label>
                  <select
                    value={newViolenceType}
                    onChange={(e) => setNewViolenceType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Fisik">Kekerasan Fisik</option>
                    <option value="Psikis">Kekerasan Psikis</option>
                    <option value="Seksual">Kekerasan Seksual</option>
                    <option value="Penelantaran">Penelantaran</option>
                    <option value="Eksploitasi">Eksploitasi Anak</option>
                    <option value="TPPO">TPPO (Tindak Pidana Perdagangan Orang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hubungan Pelaku dengan Korban</label>
                  <input
                    type="text"
                    placeholder="Contoh: Suami, Orang Tua, Guru, Tetangga"
                    value={newPerpetratorRelation}
                    onChange={(e) => setNewPerpetratorRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Urgensi Kasus</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Darurat">Darurat (Butuh Evakuasi/Shelter Segera)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Petugas / Konselor Pendamping</label>
                  <input
                    type="text"
                    placeholder="Nama Petugas UPTD PPA"
                    value={newOfficer}
                    onChange={(e) => setNewOfficer(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kronologi Singkat Kejadian</label>
                <textarea
                  rows={4}
                  placeholder="Uraikan kronologi kejadian kekerasan secara objektif..."
                  value={newChronology}
                  onChange={(e) => setNewChronology(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('cases')}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-800 text-white font-semibold rounded-xl text-xs hover:bg-teal-900 shadow-sm"
                >
                  Simpan Laporan Kasus
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: AI ASSISTANT & REPORT GENERATOR */}
        {activeTab === 'ai-assistant' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-teal-700" />
                  <span>Asisten AI UPTD PPA & Pembuatan Laporan</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Gunakan kecerdasan buatan Gemini untuk analisis hukum, rancangan intervensi psikososial, dan draf laporan resmi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Prompt Controls / Quick Templates */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Template Cepat Asisten</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const text = "Buatkan draf surat rujukan resmi penanganan medis dan visum et repertum ke RSUD Mbay untuk korban kekerasan fisik di Kabupaten Nagekeo dengan bahasa formal pemerintahan.";
                        setAiPrompt(text);
                        handleAskAI(text);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 transition-colors text-xs font-medium text-slate-700 border border-slate-200 flex items-center justify-between"
                    >
                      <span>Draf Surat Rujukan ke RSUD Mbay</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        const text = "Berikan panduan langkah-langkah penjangkauan darurat (emergency outreach) untuk kasus TPPO (Tindak Pidana Perdagangan Orang) di wilayah pesisir Kabupaten Nagekeo.";
                        setAiPrompt(text);
                        handleAskAI(text);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 transition-colors text-xs font-medium text-slate-700 border border-slate-200 flex items-center justify-between"
                    >
                      <span>Panduan Penanganan Kasus TPPO</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        const text = "Susun draf laporan bulanan UPTD PPA Kabupaten Nagekeo mengenai tren kekerasan terhadap anak dan perempuan serta rekomendasi pencegahan berbasis desa.";
                        setAiPrompt(text);
                        handleAskAI(text);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 transition-colors text-xs font-medium text-slate-700 border border-slate-200 flex items-center justify-between"
                    >
                      <span>Draf Laporan Bulanan UPTD PPA</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-teal-900 text-white rounded-2xl p-6 space-y-3 shadow-md">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-300" />
                    <span>Standar Operasional Prosedur (SOP)</span>
                  </h4>
                  <p className="text-xs text-teal-100 leading-relaxed">
                    Setiap analisis AI mematuhi prinsip kerahasiaan korban, perlindungan data pribadi, dan perundang-undangan perlindungan anak yang berlaku di Republik Indonesia.
                  </p>
                </div>
              </div>

              {/* Chat / AI Interaction Panel */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Pusat Konsultasi & Pembuatan Draf</h3>
                    <span className="text-xs bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md font-medium">Model: Gemini AI v3.8</span>
                  </div>

                  {/* Response Box */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[300px] max-h-[450px] overflow-y-auto text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {aiLoading ? (
                      <div className="flex flex-col items-center justify-center h-48 space-y-3 text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin text-teal-700" />
                        <p>Sedang memproses analisis dan menyusun draf profesional...</p>
                      </div>
                    ) : aiResponse ? (
                      aiResponse
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 space-y-2">
                        <Sparkles className="w-8 h-8 text-slate-300" />
                        <p>Pilih template cepat di samping atau ketik pertanyaan hukum / permintaan draf laporan di bawah ini.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input box */}
                <div className="pt-2 flex gap-3">
                  <input
                    type="text"
                    placeholder="Ketik instruksi atau pertanyaan untuk Asisten AI UPTD PPA..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  <button
                    onClick={() => handleAskAI()}
                    disabled={aiLoading}
                    className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Kirim</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DIRECTORY & REFERRAL */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Direktori Layanan & Rujukan Kabupaten Nagekeo</h2>
              <p className="text-xs text-slate-500 mt-1">Mitra jejaring kerja UPTD PPA dalam penanganan kasus kekerasan terhadap perempuan dan anak.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">RSUD Mbay</h3>
                <p className="text-xs text-slate-500">Layanan Visum et Repertum, penanganan medis darurat korban kekerasan fisik & seksual.</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Kontak:</strong> (0384) 211xx</p>
                  <p><strong>Lokasi:</strong> Mbay, Aesesa, Nagekeo</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Polres Nagekeo (Unit PPA)</h3>
                <p className="text-xs text-slate-500">Penyidikan hukum, laporan kepolisian (LP), dan pengamanan TKP / perlindungan hukum.</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Kontak:</strong> (0384) 21xxx</p>
                  <p><strong>Lokasi:</strong> Mbay, Kabupaten Nagekeo</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Dinas Sosial Kabupaten Nagekeo</h3>
                <p className="text-xs text-slate-500">Bantuan sosial, jaminan perlindungan sosial, dan rujukan panti / rumah aman.</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Kontak:</strong> (0384) 21xxx</p>
                  <p><strong>Lokasi:</strong> Kompleks Kantor Bupati Nagekeo, Mbay</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>© 2026 UPTD Perlindungan Perempuan dan Anak (PPA) Kabupaten Nagekeo, Nusa Tenggara Timur.</p>
        <p className="mt-1">Sistem Informasi Manajemen & Pelaporan Kasus (SIMP-PPA)</p>
      </footer>

      {/* Modal Detail Kasus */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">{selectedCase.regNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="text-xs text-slate-500">Dilaporkan: {selectedCase.dateReported}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Detail Kasus: {selectedCase.victimName} ({selectedCase.victimAge} thn)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Kategori Korban</span>
                <strong className="text-slate-900">{selectedCase.category}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Jenis Kelamin</span>
                <strong className="text-slate-900">{selectedCase.victimGender}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Wilayah</span>
                <strong className="text-slate-900">Kec. {selectedCase.kecamatan}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Desa / Kelurahan</span>
                <strong className="text-slate-900">{selectedCase.desa}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Jenis Kekerasan</span>
                <strong className="text-slate-900">{selectedCase.violenceType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Status Penanganan</span>
                <strong className="text-teal-800">{selectedCase.status}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Kronologi Kasus</h4>
              <p className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                {selectedCase.chronology}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Layanan Diberikan</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.servicesProvided.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-teal-50 text-teal-800 font-medium rounded-lg text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Petugas Pendamping</h4>
              <p className="text-xs text-slate-800 font-medium">{selectedCase.officerInCharge}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  handleAiAnalyzeCase(selectedCase);
                  setSelectedCase(null);
                }}
                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analisis & Draf AI</span>
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
