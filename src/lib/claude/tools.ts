import type { OnboardingReports } from "@/types";

export const ONBOARDING_TOOL_NAME = "submit_onboarding_reports";

export const onboardingReportsTool = {
  name: ONBOARDING_TOOL_NAME,
  description:
    "Yabancı bir kod deposu için Türkçe oryantasyon raporlarını yapılandırılmış biçimde gönder.",
  input_schema: {
    type: "object" as const,
    properties: {
      projenin_kalbi: {
        type: "object",
        properties: {
          baslik: { type: "string", description: "Rapor başlığı: Projenin Kalbi" },
          ozet: { type: "string", description: "Genel özet paragraf" },
          kritik_ogeler: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              type: "object",
              properties: {
                dosya_veya_fonksiyon: { type: "string" },
                neden_kritik: { type: "string" },
              },
              required: ["dosya_veya_fonksiyon", "neden_kritik"],
            },
          },
        },
        required: ["baslik", "ozet", "kritik_ogeler"],
      },
      veri_akisi_haritasi: {
        type: "object",
        properties: {
          baslik: { type: "string", description: "Rapor başlığı: Veri Akış Haritası" },
          giris_noktasi: { type: "string" },
          adimlar: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sira: { type: "number" },
                katman: { type: "string" },
                dosya_veya_modul: { type: "string" },
                aciklama: { type: "string" },
              },
              required: ["sira", "katman", "dosya_veya_modul", "aciklama"],
            },
          },
          veritabani_veya_kalici_katman: { type: "string" },
        },
        required: [
          "baslik",
          "giris_noktasi",
          "adimlar",
          "veritabani_veya_kalici_katman",
        ],
      },
      ilk_gorev_onerisi: {
        type: "object",
        properties: {
          baslik: { type: "string", description: "Rapor başlığı: İlk Görev Önerisi" },
          gorev_basligi: { type: "string" },
          aciklama: { type: "string" },
          hedef_dosyalar: {
            type: "array",
            items: { type: "string" },
          },
          beklenen_kazanim: { type: "string" },
          zorluk: { type: "string", enum: ["kolay", "orta"] },
        },
        required: [
          "baslik",
          "gorev_basligi",
          "aciklama",
          "hedef_dosyalar",
          "beklenen_kazanim",
          "zorluk",
        ],
      },
    },
    required: [
      "projenin_kalbi",
      "veri_akisi_haritasi",
      "ilk_gorev_onerisi",
    ],
  },
};

export function parseToolReports(input: unknown): OnboardingReports {
  const data = input as OnboardingReports;
  if (
    !data?.projenin_kalbi ||
    !data?.veri_akisi_haritasi ||
    !data?.ilk_gorev_onerisi
  ) {
    throw new Error("Claude araç çıktısı eksik veya geçersiz.");
  }
  return data;
}
