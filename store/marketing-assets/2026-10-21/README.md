# Luna Cycle — “İyi ki Luna var.” kampanyası

21 Ekim 2026. Amaç: takvim, notlar ve döngü günlüğünü sakin, güven veren bir kişisel yardımcı diliyle anlatmak. Dönüşüm artışı bir hedeftir, doğrulanmış sonuç veya garanti değildir. Ücretli reklam satın alınmadı, Apple Ads kampanyası başlatılmadı.

## Doğrulanan proje ve gerçek özellikler

Repository: https://github.com/evrenaltindal-creator/luna-cycle

İncelenen HEAD ve fetch sonrası origin/main: `879337f1f16e2fdb8d86b3a6f27138e1603e8b56`. Depodaki kullanıcıya ait .gitignore değişikliği, docs/PRODUCT_BACKLOG_TR.md ve tools/ korunur ve bu kampanya commit'ine eklenmez.

| Gerçek özellik | Kaynak |
| --- | --- |
| Geçmiş adet başlangıcı ve bilinen bitiş tarihini ekleme/düzenleme/silme | client/src/pages/Home.tsx: CalendarRecordModal, HistoryView |
| Tarih seçme, geçmiş kayıtları takvimde görme | Home.tsx: CalendarView |
| Akış, belirtiler, enerji, ruh hâli ve serbest not kaydı | client/src/features/symptoms/DailyCheckin.tsx |
| Kayıt temelli içgörü/özetler | Home.tsx: InsightsView; features/insights/personalInsights.service.ts |
| En az üç uygun tamamlanmış aralıktan sonra yaklaşık başlangıç aralığı; seyrek/eski kayıtta ihtiyat | features/cycle/cyclePrediction.service.ts |
| Yerel hatırlatmalar; desteklenen yerel cihazda biyometrik kilit | features/notifications; features/security; Home.tsx: NativeSettingsPanel |
| JSON yedek alma/içe aktarma ve veri temizleme | features/cycle/cycle.storage.ts; features/backup; Home.tsx: DataTools |
| TR, EN, RU, DE, ES arayüzü | client/src/i18n/language.ts |

Reklamlar yalnız takvim/notlar/döngü takibini söyler. Sağlık verileri, gizlilik, tahmin doğruluğu, tıbbi sonuç, doğum kontrolü veya doğurganlık iddiası yoktur. Arapça arayüz desteği yoktur; Arapça destek varmış gibi bir metin veya görsel hazırlanmadı. Mevcut İngilizce ve diğer yerelleştirmelere Türkçe görsel kopyalanmaz.

## Marka ve gerçek ekranlar

- Gerçek kırmızı gül simgesi: resources/icon.png → references/luna-rose-icon.png.
- Gerçek Türkçe ekranlar: references/tr-home-iphone.jpg, tr-calendar-iphone.jpg, tr-history-iphone.jpg. Bunlar önceki mağaza hazırlığında alınmış, sentetik demo kayıtları içeren mevcut ekranlardır; yeni hayalî arayüz oluşturulmadı.
- Kod paleti: --bone #f8f1f3, --paper #fffafb, --ink #2f1d26, --sage #8d1c3f, --sage-soft #f0dbe2, --lemon #e05068. Gül görselindeki bordo/mürdüm kimlik korundu.
- Son kullanıcı yönü: telefon kadına bakar, kamera arka yüzü görür. İlk kameraya dönük telefon pozu reddedildi. Son fotoğraflarda görünen ekran yoktur.

## Teslim dosyaları

| Dosya | Kesin ölçü | Biçim | Kullanım |
| --- | --- | --- | --- |
| luna-tr-poster-1206x2622.png | 1206 × 2622 | PNG, 24-bit RGB, alpha yok | Dikey yaşam tarzı reklam afişi; uygulama screenshot'ı değildir |
| luna-tr-header-3840x1646.png | 3840 × 1646 | PNG, 24-bit RGB, alpha yok | Türkçe CPP Header |
| luna-tr-search-1920x1280.png | 1920 × 1280 | PNG, 24-bit RGB, alpha yok | Türkçe CPP Search Results |

Orijinal üretimler originals/ içinde korunur; v1-rejected dosyaları yüklenmez. Yerleşik image_gen kullanıldı. Nihai promptların tamamı [PROMPTS.md](PROMPTS.md) içindedir. Ölçüler, biçim ve hash'ler [manifest.json](manifest.json) içindedir. Kompozisyonlar mekanik resize ile export edildi; bu yeni piksel ölçüsü, doğal üretim çözünürlüğünün artmış olduğu iddiası değildir.

Görsel kontrol: Türkçe reklam metinleri doğru; yüz/telefon/el pozu doğal, cihaz ekrana ters tutulmuyor; hayalî UI veya ek vaat yok. Header'da içerik merkezde tutuldu; Apple cihaz önizlemesinde son kırpma kontrolü ayrıca yapılmalı. Search tipografisi kısa ve yüksek kontrastlıdır. Üretimdeki kişinin gerçek bir Luna kullanıcısı veya testimonial olduğu iddia edilmez; AI lifestyle görselidir. Küçük boyut QA görüntüleri proof/ altında 302 × 656, 960 × 412 ve 480 × 320 ölçülerinde üretilip görsel olarak incelendi; reklam metni bu boyutlarda okunuyor.

## App Store sınırları ve yükleme

- App: 6805474239, Luna Cycle 1.0.0 (22). 21 Ekim'de canlı App Store Connect'te **Ready for Distribution** doğrulandı; ana sayfa değiştirilmez.
- Kampanya CPP: **Luna Cycle — İyi ki Luna var. — TR**; yalnız Turkish yerelleştirmesi.
- CPP URL: https://appstoreconnect.apple.com/apps/6805474239/distribution/productpages/e0436eb0-72fa-41fc-9ecd-e03d80bac8ac
- Product Page ID: 5590836c-4c97-45a8-b91b-db71f971007f.
- Önceki çok dilli “Luna Cycle — Adet Günlüğü” taslağı silinmedi veya gönderilmedi. İlk iki yükleme bu taslakta yapıldı, sonra aynı kitaplık varlıkları yeni TR kampanyada yeniden kullanıldı; ek ikili yükleme yapılmadı. Eski taslakta TR keyword'leri de kaydedildi. İngilizce görünümde “Using Turkish search results asset” otomatik geri dönüşü görüldüğü için yalnız Türkçe yeni kampanya ayrıldı. Eski taslak yayın hedefi değildir.
- Dar görünümdeki medya türü menüsünden App Previews and Screenshots ve Media Manager açıldı. Büyük Face ID iPhone setinde 3/10; iPad 13 inç setinde 3/10 gerçek, önceden onaylanmış ekran seçildi. Küçük/orta iPhone kategorisi aynı ekranları “Using Existing Assets” ile ölçekli kullanıyor; oradaki 0/10 override sayacı eksik ekran anlamına gelmez.
- Apple screenshot alanında uygulamanın kullanımını/deneyimini ağırlıklı göstermeyi ister. Ekranı görünmeyen yaşam tarzı afişi doğrudan screenshot yerine sunulmaz. Dikey afiş pazarlama dosyası olarak korunur; gerçek ekranlar ayrı tutulur. Ölçünün kabul edilebilir olması içerik onayı anlamına gelmez.
- Yeni TR kampanya: Header **1/1**, Search Results **1/1**. Dosya yükleme/işleme bitti; bu sayaçlar Apple içerik incelemesinin onaylandığını veya kampanyanın yayınlandığını göstermez.
- Kaydedilmiş keyword'ler: **adet, döngü, takvim, günlük, regl**. Yalnız görünür mevcut sürüm checkbox'larından seçildi. Kampanyada yalnız TR olduğundan İngilizce/Arapça keyword ya da görsel alanı oluşturulmadı; farklı dilde metadata eklenmedi. Mevcut ana mağazanın 5 diline dokunulmadı.
- Promo: “Döngünü sade ve huzurlu takip et. Takvimin, notların ve döngün tek yerde. İyi ki Luna var.” (90/170 karakter). Yeni CTA, fiyat veya ek vaat eklenmedi; deep link boş.
- **Son Submit for Review işleminden hemen önce kullanıcıdan açık onay istenir. Onay alınmadan Apple incelemesine gönderilmez.**
- Fiyat, ülke, gizlilik/DSA, sözleşmeler, binary ve A/B testleri değiştirilmez.

## Resmî kaynaklar

- [Creative asset ölçüleri](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications)
- [Screenshot ölçüleri](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) — 1206 × 2622 medium Dynamic Island; mevcut 1242 × 2688 büyük Face ID ekranları da geçerli bir kategoridir.
- [Asset best practices](https://developer.apple.com/app-store/asset-best-practices/) — gerçek uygulama deneyimi, kısa yerelleştirilmiş metin ve güvenli alan.

## İşlem kaydı

Üretim/export tamamlandı. Türkçe kampanya header/arama varlıkları yüklendi, mevcut onaylı iPhone/iPad ekranları bağlandı, keyword/promo kaydedildi. Kullanıcının açık “evet” onayından sonra Add for Review ve son Submit for Review tamamlandı. Apple'ın gösterdiği tarih: **Oct 21, 2026 at 6:00 PM**. Gönderim ID: **a6d92a49-e5ec-40a6-94bd-1c1212290b69**. [Gönderim ayrıntıları](https://appstoreconnect.apple.com/apps/6805474239/distribution/reviewsubmissions/details/a6d92a49-e5ec-40a6-94bd-1c1212290b69) ve Türkçe CPP **Waiting for Review** durumunda doğrulandı. Header ve Search Results varlıkları da Asset Library'de ayrı ayrı **Waiting for Review** olarak doğrulandı. Apple, CPP'ye atanmış varlıkları aynı gönderime otomatik dahil ettiği için gönderim ekranı tek CPP öğesi gösterir; görseller ayrı bir gönderimle tekrar gönderilmedi. Önceki çok dilli taslak gönderilmedi; binary, fiyat, ülke, gizlilik ve sözleşmeler değiştirilmedi. Kampanya henüz onaylanmış/yayınlanmış olarak raporlanmaz. Git commit/push sonucu teslim raporunda tam SHA ile verilir (kendi SHA'sını içeren commit oluşturulamaz).

Gönderim kanıtları: proof/review-submitted-2026-10-21.jpg, proof/submission-details-2026-10-21.jpg ve proof/assets-waiting-for-review-2026-10-21.jpg. [Apple'ın atanmış varlıkların otomatik incelemeye dahil edilmesi açıklaması](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-assets-from-asset-library).

Gerçek ekran sırası: iPhone **Ana ekran → Takvim → Geçmiş** (1242 × 2688 JPEG); iPad **Ana ekran → Geçmiş → İçgörüler** (2048 × 2732 JPEG). Apple kitaplığından aynı önceden onaylı dosyalar yeniden kullanıldı. Yerel referanslar references/ altındadır. 1206 × 2622 RGB PNG gerçek iPhone ekran export'ları da hazırlandı, ancak tekrar yüklenmedi; ana kaynaklar aynen kullanıldı.

Kalan riskler: Apple'ın yaratıcı içerik onayı garanti edilemez; CTA ve metinler Apple incelemesine tabidir. Bu kampanya yalnız Türkçedir; başka dillerde kullanım için ayrı dil uyarlamaları gerekir. Dikey afiş uygulama screenshot'ı değildir ve ilk screenshot olarak yüklenmedi. Tam fiziksel cihaz App Store görünümü ancak onay/yayından sonra ayrıca kontrol edilebilir. A/B testi ve ölçümlenmiş dönüşüm sonucu yoktur.
