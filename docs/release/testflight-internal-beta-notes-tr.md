# Luna Cycle — TestFlight Internal Testing Notes

Bu build, Luna Cycle’ın iOS native davranışlarını internal testing kapsamında doğrulamak içindir.

Test edilecek ana alanlar; adet döngüsü kaydı, günlük check-in, yerel tahmin aralıkları, cihaz içi veri saklama, yerel hatırlatmalar ve gizlilik ekranıdır. İlk sürümde bütün mevcut özellikler ücretsizdir; paywall, satın alma veya reklam alanı görünmemelidir.

Lütfen aşağıdaki akışları gerçek kişisel veri kullanmadan, synthetic test verisiyle deneyin: temiz kurulum ve ilk açılış; örnek dönem kaydı; Daily Check-In oluşturma, düzenleme ve silme; takvim ay geçişi; kişisel içgörüler; açık/koyu/sistem tema; uygulamayı force-close edip yeniden açma; yerel bildirim; cihaz doğrulaması; background/app switcher privacy; JSON export/import; notch/Dynamic Island ve keyboard davranışı.

Bir sorun bulunursa cihaz modeli, iOS sürümü, TestFlight build numarası, tekrar üretme adımları ve varsa ekran görüntüsünü paylaşın. Kişisel dönem tarihi, ruh hâli, semptom, not, satın alma token’ı veya hesap şifresi paylaşmayın. Bu beta tıbbi teşhis, tedavi veya doğurganlık garantisi sunmaz.

## Acceptance record

| Alan | Değer |
|---|---|
| TestFlight build | Gerçek build numarası App Store Connect’ten doldurulacak |
| Device | Test cihazından doldurulacak |
| iOS | Test cihazından doldurulacak |
| Install source | TestFlight |
| Test sonucu | PASS / FAILED / NOT VERIFIED |
