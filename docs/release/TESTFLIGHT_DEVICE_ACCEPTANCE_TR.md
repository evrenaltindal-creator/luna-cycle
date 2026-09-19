# Luna Cycle — TestFlight Cihaz Kabul Kontrolü

Bu kontrol listesi TestFlight'tan yüklenen gerçek iPhone build'i içindir. Test boyunca yalnızca sentetik veri kullanın; kişisel sağlık verisi, parola veya satın alma belirteci kaydetmeyin ya da paylaşmayın.

## Test bilgileri

| Alan | Değer |
|---|---|
| Sürüm / build | TestFlight'tan doldurulacak |
| Cihaz | Test cihazından doldurulacak |
| iOS | Test cihazından doldurulacak |
| Kurulum kaynağı | TestFlight |
| Sonuç | PASS / FAILED / NOT VERIFIED |

## Temel akışlar

- [ ] Temiz kurulum, ilk açılış ve onboarding tamamlanıyor.
- [ ] Sentetik bir adet dönemi eklenebiliyor, düzenlenebiliyor ve silinebiliyor.
- [ ] Günlük check-in oluşturma, düzenleme ve silme çalışıyor.
- [ ] Takvim ay geçişleri ve yerel tarih gösterimleri doğru.
- [ ] Tahmin aralıkları ve kişisel içgörüler kayıtlara göre güncelleniyor.
- [ ] Açık, koyu ve sistem teması okunaklı; yeniden açılışta tercih korunuyor.
- [ ] JSON dışa aktarma ve geçerli JSON içe aktarma çalışıyor.
- [ ] Tüm yerel verileri silme işlemi onay istiyor; vazgeçme veriyi koruyor.

## iOS yerel davranışları

- [ ] Bildirim izni isteniyor ve sonraki dönem hatırlatıcısı planlanıyor.
- [ ] Bildirim tercihi kapatılınca planlanmış hatırlatıcı iptal ediliyor.
- [ ] Face ID / Touch ID kilidi etkinleştirilebiliyor ve uygulama yeniden açılınca doğrulama istiyor.
- [ ] Uygulama arka plana alınınca hassas içerik app switcher'da gizleniyor.
- [ ] Notch / Dynamic Island, safe-area ve klavye davranışı içeriği kapatmıyor.

## Luna Plus / StoreKit sandbox

- [ ] Aylık ve yıllık ürünler Apple'dan fiyatlarıyla yükleniyor.
- [ ] Satın alma penceresi açılıyor; sandbox satın alma sonucu entitlement'ı etkinleştiriyor.
- [ ] Uygulama zorla kapatılıp açılınca entitlement korunuyor.
- [ ] Satın alımları geri yükle akışı çalışıyor.
- [ ] Premium değilken yalnızca gerçekte mevcut premium faydalar gösteriliyor.

## Hata kaydı

Hata bulunursa cihaz modeli, iOS sürümü, TestFlight build numarası, tekrar üretme adımları ve gerekirse hassas veri içermeyen ekran görüntüsü kaydedilmelidir.
