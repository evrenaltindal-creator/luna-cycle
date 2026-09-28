# Google Play Health Apps Declaration — Hazırlık Notları

**Uygulama:** Luna Cycle  
**Package:** `com.lunacycle.app`  
**Durum:** Google Play Console Health Apps declaration için hazırlık; form seçenekleri ve güncel politika metni yayın öncesinde tekrar doğrulanmalıdır.

## Ürün kategorisi ve amacı

Luna Cycle için en doğru ürün açıklaması **period / menstrual cycle tracking** ve kullanıcı tarafından girilen kayıtlar üzerinden **informational cycle estimates** sağlayan bir tüketici uygulamasıdır. Uygulama; adet dönemlerini, günlük check-in bilgilerini, takvimi, yerel hatırlatmaları ve temel içgörüleri düzenlemeye yardımcı olur.

## Sağlık işlevi

Uygulamanın sağlıkla ilişkili işlevi, kullanıcının girdiği period/cycle kayıtlarını cihazda saklamak ve en az üç tamamlanmış döngü aralığından sonra yaklaşık adet başlangıcı aralıkları göstermektir. Yumurtlama zamanı, doğurgan veya güvenli gün hesaplanmaz; işaretlenmeyen günler gebelik riski yok anlamına gelmez. Çıktılar doğum kontrolü, tanı, tedavi veya klinik karar desteği değildir.

## Medical device değerlendirmesi

**Medical device:** No. Luna Cycle bir tıbbi cihaz olarak sunulmaz. Uygulama medical diagnosis, treatment, clinical decision support veya emergency medical guidance sağlamaz.

## Health data işleme notu

Kullanıcı tarafından girilen PeriodRecord, DailyLog, flow, spotting, cramps, energy, moods, symptoms, notes, cycle dates ve tahminler current release’te öncelikle cihazda tutulur. Luna tarafından işletilen uzak bir health backend’i veya health analytics sistemi yoktur. Bu veriler reklam hedeflemesi veya ödeme payload’ı olarak kullanılmaz.

## Risk ve disclaimer metni

Store listing ve uygulama içi yasal metinlerde şu kapsam korunmalıdır: tahminler yaklaşık ve bilgilendirme amaçlıdır; contraception, pregnancy prevention, diagnosis, treatment veya emergency medical decisions için kullanılmamalıdır; sağlık sorularında qualified healthcare professional’a başvurulmalıdır.

## Account ve access

Current release’te Luna hesabı, remote login veya register akışı bulunmamaktadır. Reviewer’ın tüm mevcut özellikleri görmek için hesap açması veya satın alma yapması gerekmez.

## Advertising ve monetization notu

İlk sürüm ücretsizdir; uygulama içi satın alma, abonelik, premium kilidi veya reklam alanı gösterilmez. Paketlenen SDK'ların gerçek veri işleme davranışı final binary üzerinden ayrıca denetlenmelidir.

## Declaration öncesi doğrulama

Google Play’in güncel Health Apps policy’si, Data Safety formu, privacy policy URL’si, production SDK ve reklam hesabı ayarları birlikte incelenmelidir. Formda medical device veya clinical decision support için “No” seçimi yapılmadan önce ürünün gerçek UI ve store copy’si bu sınırlarla karşılaştırılmalıdır. Legal entity, privacy contact ve applicable jurisdiction alanları [LEGAL NAME], [CONTACT EMAIL] ve [JURISDICTION] placeholder’ları doldurulduktan sonra gönderilmelidir.
