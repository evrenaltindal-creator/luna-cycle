# Luna Cycle Tasarım Beyin Fırtınası

## Yaklaşım 1 — Sessiz Ay Takvimi

**Very Brief Intro:** Koyu mürekkep, sıcak kemik ve adaçayı tonlarıyla editorial wellness estetiği. Kullanıcıya “verilerinin yanında duran sakin bir masaüstü nesnesi” hissi verir.

**Probability:** 0.07

## Yaklaşım 2 — Sabah Işığı Arşivi

**Very Brief Intro:** Kırık beyaz zemin, kobalt çizgiler ve güneşli sarı vurgularla aydınlık bir sağlık günlüğü. Bilgi mimarisini daha görünür ve enerjik kılar.

**Probability:** 0.04

## Yaklaşım 3 — Gece Çizelgesi

**Very Brief Intro:** Lacivert fon, düşük yoğunluklu lavanta ışığı ve teknik takvim işaretleriyle daha dijital, ritmik ve gece odaklı bir deneyim. Gizlilik temasını görsel olarak güçlendirir.

**Probability:** 0.08

# Seçilen Yaklaşım: Sessiz Ay Takvimi

## Design Movement

Contemporary editorial wellness: 1970’lerin kâğıt takvimlerini, modern veri arayüzünün hassas hiyerarşisiyle birleştiren sakin ve dokunsal bir görsel dil.

## Core Principles

İlk ilke, bilgiyi sakince katmanlandırmaktır: kritik tarih ve kalan gün öne çıkar, ayrıntılar ikinci planda kalır. İkinci ilke, mahremiyetin sadece metinle değil yüzey, boşluk ve kontrol hissiyle de anlatılmasıdır. Üçüncü ilke, yumuşak kartlar yerine belirgin “dosya / takvim” yüzeyleri kullanmaktır. Dördüncü ilke, kadın sağlığı estetiğini klişe pembe yerine adaçayı, mürekkep ve narenciye vurgularıyla yeniden kurmaktır.

## Color Philosophy

Ana yüzey sıcak kemik (`#F5F1E8`), metin gece mürekkebi (`#202526`), marka rengi koyu adaçayı (`#52655A`) ve vurgu ekşi limon (`#E8C85A`) olacaktır. Bu palet hem sakinliği hem de eylem anlarını taşır: adaçayı güven ve sürekliliği, limon “bugün” ve önemli CTA’ları, kemik yüzey ise ekranı bir sağlık günlüğü gibi hissettirir.

## Layout Paradigm

Merkezlenmiş landing page yerine solda sabit bir navigasyon rayı, sağda geniş içerik kanvası ve asimetrik “bugün / yaklaşan dönem / veri notu” blokları kullanılacaktır. Mobilde bu ray alt navigasyona dönüşür. Dashboard, tek tip kart ızgarası yerine bir takvim masasındaki belgeler gibi üst üste binen fakat okunaklı yüzeylerden oluşacaktır.

## Signature Elements

İlk imza, her ana bölümde görünen ince tarih çizgisi ve küçük “Ay notu” etiketi olacaktır. İkinci imza, gerçek kayıtlar için katı adaçayı noktalar; tahminler için kesik limon konturlarıdır. Üçüncü imza, hero alanında metinle birlikte kullanılan soyut, ay fazlarını andıran kâğıt dokulu dairesel marka sembolüdür.

## Interaction Philosophy

Etkileşimler “kontrol bende” duygusu vermelidir. Kayıt ekleme, kısa ve geri alınabilir bir akış olarak açılır; silme gibi riskli eylemler açıkça onay ister. Hover durumları sessizce yükselir, seçilen gün renk değişiminden önce küçük bir işaret ve metinle açıklanır.

## Animation

Girişte bölümler 30–60 ms kademelerle yumuşak biçimde görünür. Kartlar yalnızca `transform` ve `opacity` ile 180–260 ms aralığında hareket eder. Ana CTA basıldığında 160 ms’lik hafif küçülme uygulanır. Takvim seçimi, tarih çizgisinin kısa bir “mühür basma” hareketiyle tamamlanır. `prefers-reduced-motion` aktifse tüm dekoratif animasyonlar kapatılır.

## Typography System

Başlıklarda `DM Serif Display`, gövde ve arayüzde `Manrope` kullanılacaktır. Ana başlıklar büyük ama kısa tutulur; veri değerleri Manrope 700 ile, açıklamalar Manrope 500 ile yazılır. Serif yalnızca marka, büyük bölüm başlıkları ve önemli tarih vurgularında kullanılır; böylece arayüz dergi sayfası gibi kalır fakat okunabilirliği kaybetmez.

## Brand Essence

Luna Cycle, döngüsünü sakin ve özel biçimde takip etmek isteyen kadınlar için cihazında kalan, tahminleri kesinlik gibi sunmayan bir döngü günlüğüdür. Kişilik: **sakin, dürüst, özenli**.

## Brand Voice

Başlıklar kısa ve nefes alan; CTA’lar direkt ama buyurgan olmayan bir tonda yazılır. Mikrocopy, tahmin ile gerçek arasındaki farkı saklamaz.

“Bugün bedeninin ritmine küçük bir not bırak.”

“Yaklaşan dönemini gör; kesinlik değil, daha iyi hazırlık.”

## Wordmark & Logo

Logo, tek bir daire içinde üç farklı yoğunlukta ay fazını gösteren, metinsiz bir semboldür. Wordmark, serif “Luna” ve aralıklı küçük harflerle yazılmış “CYCLE” ikilisinden oluşur. Sembol hem masaüstü navigasyonunda hem mobil alt navigasyonda tek başına tanınabilir.

## Signature Brand Color

**Adaçayı mürekkebi — `#52655A`**. Doğal ama pastel olmayan, hem açık zeminde hem koyu modda markayı ayırt edebilen ana sahiplenilebilir renktir.

## Style Decisions

Tasarım boyunca sıcak kemik arka plan, koyu mürekkep tipografi, adaçayı ana renk, limon vurgu, serif-display + sans-serif veri hiyerarşisi ve asimetrik dashboard kompozisyonu korunacaktır. Klişe pembe, mor neon, yoğun gradient ve her bileşene aynı yuvarlatılmış köşe uygulanmayacaktır.

## Style Decisions

İlk görsel kontrolden sonra ana yüzeyler daha belirgin “katmanlı kâğıt / takvim dosyası” hissi verecek şekilde güçlendirilecektir. Her ana blokta ince tarih çizgisi veya “Ay notu” etiketi tekrar edecektir. Lemon `#E8C85A` yalnızca bugün, tahmin sınırı ve birincil eylemler için kullanılacak; adaçayı `#52655A` gerçek kayıtlar ve navigasyonun sabit alanı olarak kalacaktır.
