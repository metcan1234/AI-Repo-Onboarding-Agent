export interface ProjectFileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: ProjectFileNode[];
  preview?: string;
}

export interface KeyFileSummary {
  path: string;
  role: string;
  preview?: string;
}

export interface ParsedRepository {
  rootPath: string;
  languages: string[];
  frameworks: string[];
  entryPoints: string[];
  keyFiles: KeyFileSummary[];
  structure: ProjectFileNode[];
  metadata: {
    totalFilesScanned: number;
    maxDepth: number;
    truncated: boolean;
  };
}

export interface CriticalItem {
  dosya_veya_fonksiyon: string;
  neden_kritik: string;
}

export interface ProjeninKalbiReport {
  baslik: string;
  ozet: string;
  kritik_ogeler: CriticalItem[];
}

export interface VeriAkisiAdimi {
  sira: number;
  katman: string;
  dosya_veya_modul: string;
  aciklama: string;
}

export interface VeriAkisiHaritasiReport {
  baslik: string;
  giris_noktasi: string;
  adimlar: VeriAkisiAdimi[];
  veritabani_veya_kalici_katman: string;
}

export interface IlkGorevOnerisiReport {
  baslik: string;
  gorev_basligi: string;
  aciklama: string;
  hedef_dosyalar: string[];
  beklenen_kazanim: string;
  zorluk: "kolay" | "orta";
}

export interface OnboardingReports {
  projenin_kalbi: ProjeninKalbiReport;
  veri_akisi_haritasi: VeriAkisiHaritasiReport;
  ilk_gorev_onerisi: IlkGorevOnerisiReport;
}

export interface AnalyzeResult {
  success: boolean;
  parsed?: ParsedRepository;
  reports?: OnboardingReports;
  error?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MentorChatRequest {
  messages: ChatMessage[];
  parsed: ParsedRepository;
  reports: OnboardingReports;
}

export interface MentorChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}
