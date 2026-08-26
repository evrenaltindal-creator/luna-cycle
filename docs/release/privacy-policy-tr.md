# Luna Cycle Gizlilik Politikası

**Son güncelleme / yürürlük tarihi:** [EFFECTIVE DATE]  
**Uygulama:** Luna Cycle  
**Paket / bundle kimliği:** `com.lunacycle.app`  
**Geliştirici / veri sorumlusu:** [LEGAL NAME]  
**İletişim:** [CONTACT EMAIL]  
**Yargı alanı:** [JURISDICTION]

Bu Gizlilik Politikası, Luna Cycle’ın mevcut sürümünde hangi bilgilerin uygulama içinde nasıl işlendiğini açıklar. Bu metin mağaza başvurusu öncesi ürün-gerçeklik taslağıdır; geliştirici tüzel kişiliği, iletişim adresi, uygulanacak hukuk ve ülkeye özgü yükümlülükler için yayın öncesinde hukuki inceleme yapılmalıdır.

## 1. Luna Cycle nedir?

Luna Cycle; adet döngüsü kaydı, günlük check-in, takvim, tahmini döngü bilgileri, içgörüler, yerel hatırlatmalar ve gizlilik kontrolleri sunan bir tüketici uygulamasıdır. Luna Cycle bir tıbbi cihaz değildir. Döngü, adet, ovülasyon veya doğurganlık penceresine ilişkin çıktılar yaklaşık ve bilgilendirme amaçlı tahminlerdir.

Bu çıktılar doğum kontrolü, gebelikten korunma, tanı, tedavi veya acil tıbbi kararlar için kullanılmamalıdır. Sağlıkla ilgili bir endişeniz varsa yetkin bir sağlık profesyoneline başvurun; acil durumlarda bulunduğunuz yerdeki yerel acil yardım hizmetlerini kullanın.

## 2. Hesap ve temel kullanım

Mevcut sürümde temel sağlık takibi için Luna hesabı, uzaktan kayıt veya giriş/kayıt akışı gerekmemektedir. Temel özellikler cihaz üzerinde kullanılabilir. Google Play veya App Store hesabı, Luna hesabından ayrı olarak, mağaza aboneliği veya uygulama içi satın alma işlemleri için gerekli olabilir.

## 3. Sizin girdiğiniz veriler

Uygulama kullanırken aşağıdaki türlerde bilgileri cihazınıza girebilirsiniz: adet dönemi başlangıç ve bitiş tarihleri, adet süresi, akış veya lekelenme bilgileri, kramplar, enerji, ruh hâlleri, belirtiler, serbest metin notları, tercih ve hatırlatma ayarları, özel bildirim metni tercihi ve tema tercihi. Uygulama bu girdilerden döngü tahmini ve yaklaşık ovülasyon bilgilendirmesi üretebilir.

Bu bilgiler sağlıkla ilişkili olabileceğinden hassas kabul edilmelidir. Sağlık kayıtları reklam hedeflemesi için kullanılmaz, reklam isteği parametresi olarak gönderilmez ve faturalandırma sistemleriyle paylaşılmaz.

## 4. Verilerin saklanması

Luna Cycle’ın mevcut mimarisinde sağlık ve döngü kayıtları öncelikle kullanıcının cihazında, web sürümünde yerel uygulama depolamasında ve native mobil sürümde native/local storage katmanında tutulur. Uygulama bu kayıtlar için Luna tarafından işletilen uzak bir sağlık verisi hesabı veya backend’i kullanmaz.

Bu ifade, cihazın işletim sistemi, depolama ortamı veya üçüncü taraf platformlarının genel güvenlik risklerinin imkânsız olduğu anlamına gelmez. Luna Cycle, mevcut ürün davranışını “verilere kimsenin erişemeyeceği”, “kırılamaz” veya “mutlak güvenlik” şeklinde garanti etmez.

## 5. Üçüncü taraf hizmetleri

Uygulama; mobil platform işlevleri için Capacitor native eklentilerini, native güvenli/yerel depolama katmanını, yerel bildirimleri, Google Play Billing veya Apple StoreKit sınırlarını ve Free katmanında contextual/non-personalized-first reklamlar için AdMob/UMP sınırını kullanır.

Üçüncü taraf hizmetleri kendi teknik belgelerine ve gizlilik politikalarına göre cihaz, ağ, mağaza veya consent yönetimiyle ilişkili teknik bilgileri işleyebilir. Bu hizmetlere sağlık kaydı, döngü tarihi, semptom, ruh hâli, not içeriği veya tahmin durumu reklam veya faturalandırma payload’ı olarak verilmez. Sağlayıcıların kesin alan ve saklama uygulamaları, seçilen SDK sürümü, platform ve hesap yapılandırmasına göre yayın öncesinde ayrıca kontrol edilmelidir.

## 6. Reklamlar

Free katmanı, yalnızca izin verilen düşük hassasiyetli yüzeylerde contextual ve non-personalized-first banner reklamlar kullanabilir. Reklam yerleşimleri mevcut tasarımda `home_footer` ve `insights_footer` ile sınırlandırılmıştır. Daily Check-In, günlük özet, takvim ayrıntısı, semptom seçici, not alanı, Privacy Center, biyometrik ekran, bildirim izni, içe/dışa aktarma, paywall ve abonelik ayarlarında reklam gösterilmemesi hedeflenmiştir.

Luna Cycle sağlık verilerini reklam hedeflemek için kullanmaz. Sağlık verileri reklam isteklerine parametre olarak gönderilmez ve sağlık verileriyle reklam profili oluşturulmaz. Luna Plus entitlement’ı aktif olduğunda reklam başlatma, istek ve aktif banner gösterimi politika gereği durdurulur.

Reklam ve consent SDK’ları, reklamı veya consent tercihini sunmak/yönetmek için gerekli olabilecek teknik cihaz veya consent bilgilerini işleyebilir. Bu bilgilerin kesin kapsamı, gerçek production SDK ve hesap ayarları yapılandırıldığında ilgili sağlayıcının güncel belgeleriyle doğrulanmalıdır.

## 7. Reklam consent’i

Reklam consent’i, uygulamanın sağlık verisiyle ilgili kontrollerinden ayrı tutulur. Reklam consent katmanında yalnızca reklam politikası için gerekli durum alanları saklanır: consent durumu, reklam isteğine izin verilip verilmediği, kişiselleştirmeye izin verilip verilmediği ve privacy options ekranının gerekli olup olmadığı.

Reklam consent’inin ham sağlayıcı yanıtı sağlık yedeğine aktarılmaz. Consent tercihinizi, uygulamada gösterilen reklam gizlilik seçenekleri veya ilgili platform/sağlayıcı ekranı üzerinden yönetebilirsiniz.

## 8. Luna Plus ve satın almalar

Luna Plus; reklamsız kullanım ve gelişmiş içgörüler gibi premium yüzeyler sunan otomatik yenilenen aylık veya yıllık abonelik seçeneklerinden oluşabilir. Ürün adı, süre ve fiyat, kullanıcının mağazasından gelen localized product details üzerinden gösterilmelidir; uygulama bu metinde sabit bir fiyat taahhüt etmez.

Ödeme ve ham kart bilgisi işleme Google Play veya Apple App Store gibi mağaza sağlayıcıları tarafından yürütülür. Luna Cycle’ın sağlık kayıtlarını mağaza satın alma sistemine göndermemesi amaçlanmıştır. Mağaza; satın alma durumu, abonelik durumu ve işlemle ilgili teknik metadata’yı kendi hizmet koşulları ve gizlilik belgelerine göre işleyebilir.

Abonelik yenileme ve iptal işlemleri mağaza hesabı üzerinden yönetilir. Luna uygulamasındaki “restore purchases” işlemi mağaza entitlement durumunu yeniden sorgulamak içindir; yerel health backup dosyası premium yetkisi vermez.

## 9. Bildirimler

Hatırlatmalar, desteklenen native cihazlarda yerel bildirim olarak planlanır. Özel bildirim metni tercihi açık olduğunda uygulama, privacy-first davranış amacıyla bildirim metnini genel tutabilir. Bildirim izni işletim sistemi tarafından yönetilir. Bildirimler sağlık verisini uzak bir Luna backend’ine gönderme amacı taşımaz.

## 10. Yedekleme ve içe/dışa aktarma

Kullanıcı açıkça başlattığında uygulama, dönem kayıtlarını, günlük logları ve uygulama tercihlerini içeren bir JSON yedek dosyası oluşturabilir. Bu dosya kullanıcı kontrolündedir ve kullanıcı tarafından seçilen konuma paylaşılabilir veya kaydedilebilir.

Dışa aktarılan dosya uygulama tarafından uzaktan silinemez. Dosyayı saklama, paylaşma ve silme sorumluluğu kullanıcıya aittir. Yedek dosyasında Luna Plus entitlement’i, ham reklam consent yanıtı, satın alma token’ı veya reklam kimliği bulunmaması hedeflenmiştir. İçeri aktarma premium erişimi açmaz.

## 11. Biyometrik veya cihaz kimliği kilidi

İsteğe bağlı uygulama kilidi, işletim sisteminin desteklediği biyometrik doğrulama veya cihaz kimliği mekanizmalarına dayanabilir. Luna Cycle biyometrik verinin kendisini toplama veya uzak bir sunucuya gönderme amacı taşımaz; doğrulama sonucu cihaz işletim sistemi tarafından yönetilir.

Cihaz kilidi işletim sistemi özelliğidir ve cihaz ayarlarına, üreticiye ve platforma göre farklılık gösterebilir.

## 12. Veri paylaşımı

Luna Cycle, sağlık kayıtlarını Luna tarafından işletilen uzak bir sağlık backend’i, sağlık analitiği sistemi, reklam hedefleme sistemi veya faturalandırma payload’ı olarak paylaşmaz. Reklam, consent ve mağaza hizmetleri sağlık verisinden bağımsız teknik/işlem bilgileri işleyebilir. Yasal zorunluluklar veya mağaza sağlayıcısının kendi hizmet işlemleri için oluşabilecek üçüncü taraf işleme, ilgili sağlayıcının kendi belgelerine tabidir.

## 13. Saklama süresi

Sağlık ve döngü kayıtları siz düzenleyene veya silene, “Tüm yerel kayıtları sil” işlevini kullanana ya da uygulamayı kaldırma/cihaz depolamasını silme gibi işletim sistemi işlemleri gerçekleşene kadar cihazda kalabilir. Bu veriler için Luna’nın mevcut sürümde uzaktan silme işlemi yoktur.

Kullanıcı tarafından dışa aktarılan yedek dosyaları uygulama dışında saklanır. Luna Cycle, kullanıcı tarafından başka bir konuma aktarılmış bir dosyayı uzaktan silemez.

## 14. Tüm yerel verileri silme

“Tüm yerel kayıtları sil” işlevi, uygulamanın yerel sağlık ve döngü verilerini mevcut ürün davranışına göre temizler. Bu işlem Google Play veya App Store aboneliğini iptal etmez ve mağaza satın alma kaydını silmez. Abonelik iptali ilgili mağaza hesabı üzerinden yapılmalıdır.

## 15. Çocukların gizliliği

Uygulama için doğrulanmış bir yaş kapısı uygulanmamıştır. Luna Cycle, uygulanabilir dijital rıza yaşının altındaki çocuklara yönelik tasarlanmamıştır. Ülkeye özgü yaş ve ebeveyn izni gereklilikleri için yayın öncesi hukuki inceleme yapılmalıdır. Geliştirici, bu taslakta belirli bir ülke yaşı veya doğrulanmış yaş sınıfı iddia etmez.

## 16. Güvenlik

Luna Cycle, verileri cihazda tutmaya ve sağlık verisini reklam/faturalandırma sınırlarından ayırmaya yönelik teknik önlemler kullanır. Native sürümde platformun güvenli/yerel depolama sınırları ve isteğe bağlı cihaz kilidi kullanılabilir. Bununla birlikte hiçbir yazılım veya cihaz ortamı mutlak olarak risksiz olduğu iddiasıyla sunulmamaktadır.

## 17. Uluslararası hususlar

Uygulama Android ve iOS platformlarında çalışabilir. Üçüncü taraf mağaza, reklam veya consent hizmetleri farklı ülkelerde teknik bilgi işleyebilir. Uluslararası aktarım, veri sorumlusu bilgileri, yasal dayanaklar ve kullanıcı hakları [JURISDICTION] ile ilgili hukuki incelemede kesinleştirilmelidir.

## 18. Politika değişiklikleri

Ürün davranışı veya hukuki gereklilikler değiştiğinde bu politika güncellenebilir. Güncel sürümde “son güncelleme” tarihi değiştirilir. Önemli değişiklikler uygulanabilir platform kuralları ve iletişim kanalları çerçevesinde duyurulmalıdır.

## 19. İletişim

Gizlilik soruları, veri talepleri veya bu politika hakkında bildirimler için [CONTACT EMAIL] adresi kullanılmalıdır. [LEGAL NAME], [BUSINESS ADDRESS] ve [JURISDICTION] bilgileri yayın öncesinde gerçek bilgilerle doldurulmalıdır.

**Not:** Bu belge ürün ve mağaza metadata hazırlığı için bir taslaktır; ülkeye özgü hukuki danışmanlık yerine geçmez.
