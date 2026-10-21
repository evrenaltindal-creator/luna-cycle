# Nihai görsel üretim promptları

Yöntem: yerleşik `image_gen`. CLI/API anahtarı kullanılmadı. Kullanıcının son geri bildirimi doğrultusunda telefon ekranı kadına dönüktür; kamera telefonun arkasını görür. Nihai fotoğraflarda uygulama arayüzü üretilmez. Gerçek ekran görüntüleri ayrı `references/` dosyalarıdır.

## Dikey afiş — v2

```text
Use case: ads-marketing, targeted correction after client feedback.
Asset type: Luna Cycle finished vertical Turkish lifestyle advertising poster, full-bleed portrait, same very tall aspect as 1206x2622.
Input image 1: previous campaign poster, reference for exact brand typography, adult woman identity, color palette and premium finish. IMPORTANT do NOT preserve its unnatural phone presentation. Input image 2: authoritative original Luna red-rose app icon.
Primary change: REPLACE the central photographed scene with a physically natural phone-use pose. The woman is seated comfortably on a cream sofa in her quiet modern burgundy home, three-quarter side profile, tiny genuine smile, looking down at the smartphone held naturally close to her in her lap/chest area. The smartphone DISPLAY FACES HER, the BACK of the phone faces the camera. Do not show the display at all. A simple unbranded matte dark-plum phone back with ordinary subtle camera lenses, NO Apple logo. Her eyes look toward the screen facing her, wrists relaxed, natural grip. She is using it for herself, not presenting it to the camera. All hands anatomically natural, no extra fingers. Warm realistic skin, cream knitwear, calm confidence, cinematic warm light, subtle pink reflections, no glamour airbrushing.
Keep finished poster hierarchy: top rose and brand, large main headline and secondary line, main lifestyle photo, bottom emotional slogan and subtle red pill CTA. Exact ad text, and NO other text:
"LUNA CYCLE"
"Döngünü sade ve huzurlu takip et."
"Takvimin, notların ve döngün tek yerde."
"İyi ki Luna var."
"Şimdi indir"
Preserve every Turkish character, correct İ, ı, ü, ö, Ş. Cream and white text on rich burgundy/plum; warm red rose; restrained soft pink glow. Plenty of safe margins, no clipped face/device/text, full phone naturally held. Photorealistic and elegant, premium consumer app campaign. No mock UI, no app screen shown, no fabricated ratings/reviews/awards/users, no health/privacy/accuracy promises, no pricing, pregnancy/babies/fertility/ovulation, pain, sadness, doctors, Apple logo, App Store badge, watermark or extra advertising words.
```

## Header — v2

```text
Use case: ads-marketing.
Asset type: Luna Cycle App Store HEADER, very wide 21:9 landscape, intended final 3840x1646 RGB PNG. One complete finished header.
Input image 1 is the corrected, client-approved direction for the Luna campaign: same adult woman in cream knitwear, warm burgundy home, and PHYSICALLY NATURAL smartphone use. Input image 2 is the authoritative red-rose app icon.
Recompose this as a wide cinematic header: a calm dark burgundy/plum field for copy on the LEFT, same adult woman sitting on a cream sofa on the RIGHT, tiny genuine smile, realistic skin texture, looking down at a phone she uses FOR HERSELF. Display faces HER; only the unbranded matte plum BACK of the phone faces camera. Never show the phone screen, no UI. Natural relaxed hands and wrists, anatomically correct grip, no extra fingers. Camera is side three-quarter, full face and phone visible with ample space above her hair and below hands, no cropped face/phone. Warm cream fabrics, subtle pink light, premium realistic photography, not pink cartoon wellness.
Brand small rose symbol and elegant cream-white typography on left, exact Turkish copy only:
"LUNA CYCLE"
"Döngünü sade ve huzurlu takip et."
"İyi ki Luna var."
"Şimdi indir"
Main headline large in 2 balanced lines; emotional line secondary; refined understated red rounded CTA, no extra ad words. Correct Turkish letters, particularly İ, ı, ü, ö, Ş.
IMPORTANT SAFE AREA: place ALL copy and rose within x=14%-48%, y=18%-82%. Keep whole face, hands, phone within x=52%-85%, y=12%-88%. Leave generous soft background at the left/right/top/bottom edges for cropping. Do not enlarge woman to fill top/bottom. All important content centrally protected, no cut text.
Preserve real red-rose identity, dark burgundy and plum, warm red, soft pink glow, cream/white. No Apple logo, App Store badge, watermark, fabricated reviews/stars/awards/users, prices, health/privacy/prediction claims, pregnancy/babies/fertility/ovulation, pain, sad expression or medical endorsement.
```

## Search Results — v2

```text
Use case: ads-marketing.
Asset type: Luna Cycle Turkish Search Results ad, 3:2 landscape, intended 1920x1280 RGB PNG, one finished composition.
Image 1: corrected campaign portrait, adult woman's identity/cream knitwear/warm burgundy home/phone usage reference. Image 2: authoritative original red-rose Luna icon. Match this campaign, but use a simpler high-contrast search composition.
One adult woman on RIGHT side, calm small genuine smile, sitting naturally on cream sofa, her face in three-quarter side view, looking down at a phone she uses for herself. The DISPLAY FACES THE WOMAN, only the matte unbranded plum BACK of phone visible to camera; do NOT show any display or UI. Her gaze, phone and grip must be physically consistent; relaxed normal wrists/hands, five fingers per hand, no extra digits. Full face and phone inside frame with padding. Real skin texture, soft warm cinematic light, not airbrushed. Dark burgundy/plum, cream textiles, soft pink glow very restrained.
LEFT side: exact rose emblem, cream/white elegant large high-contrast type, EXACTLY these Turkish strings once each:
"LUNA CYCLE"
"Kendini daha yakından tanı."
"Döngü • Takvim • Notlar"
No CTA, no other ad words. Accurate Turkish accents, correct ı and ü. Large main headline split into 2-3 balanced lines, obvious at thumbnail size. Compact clear hierarchy, less clutter than a poster. Keep ALL text in x=12%-52%, y=16%-82%; woman/phone x=55%-88%, y=10%-88%. Leave crop-safe margins. Keep phone small enough to feel natural, not held up to the audience.
No made-up UI, stars, reviews, awards, counts, prices, health/privacy or accuracy claims, medical endorsement, pregnancy, baby, fertility, ovulation, pain, sadness, Apple logo, App Store badge, watermarks, extra text. Premium photorealistic consumer brand campaign.
```

## Kaynak eşlemesi

- Dikey v2: `originals/portrait-v1-rejected-phone-pose.png` (yalnız marka/kimlik referansı), `references/luna-rose-icon.png`.
- Header ve Search v2: `originals/portrait-v2.png`, `references/luna-rose-icon.png`.
- İlk v1 taslaklarda gerçek `tr-home-iphone.jpg` ekranı referans alındı. Telefonun kameraya dönük pozu kullanıcı tarafından reddedildi; v1 dosyaları yalnız üretim geçmişi olarak korundu, yükleme için kullanılmaz.
- Kullanıcı gerçek ekranın yerel perspektifli yerleştirmesine onay verdi; ardından fotoğrafta ekranın görünmesinin önemli olmadığını belirtti. Son yön bu nedenle doğal kullanımı öne çıkarır; perspektifli ekran eklenmedi.
- Nihai export yalnız yüksek kaliteli mekanik yeniden boyutlandırma ve opak 24-bit RGB PNG dönüşümüdür; sahne/metin değiştirilmez. `export-rgb.ps1` tekrar üretilebilir işlemi belgeler.
