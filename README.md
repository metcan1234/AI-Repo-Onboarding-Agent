# AI Repo Onboarding Agent

Yabancı bir kod deposunu tarayıp yeni geliştiriciler için Türkçe oryantasyon raporları üreten Next.js paneli.

## Kurulum

```bash
npm install
cp .env.example .env
# .env içine ANTHROPIC_API_KEY ekleyin
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Evet | Claude Messages API anahtarı |
| `ALLOWED_SCAN_ROOTS` | Hayır | Virgülle ayrılmış izinli tarama kök dizinleri |

## Kullanım

1. Üst alana analiz edilecek projenin **tam yerel yolunu** girin (ör. `C:\Users\Can\projects\my-app`).
2. **Analiz Et** ile repo taranır ve Claude üç rapor üretir.
3. Sekmeler: **Kuş Bakışı**, **Mimari Yol Haritası**, **AI Mentor Chat**.

## Sınırlamalar

- Yalnızca sunucunun erişebildiği yerel dizinler okunur.
- Windows’ta mutlak yol (`C:\...`) kullanın; göreli yollar güvenlik nedeniyle reddedilir.
- Büyük repolarda dosya listesi derinlik ve dosya sayısı ile kısaltılır.
- Claude çıktısı repo önizlemelerine dayanır; eksik dosyalarda tahmin yapabilir.
