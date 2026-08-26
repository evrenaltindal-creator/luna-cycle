# Store Screenshot Shot-List

**Kapsam:** Google Play ve App Store için hazırlık. Pixel ölçüleri, cihaz oranları ve mağaza başına zorunlu screenshot sayısı final submission ekranlarında tekrar doğrulanmalıdır.

## Ortak gizlilik kuralı

Hiçbir screenshot’ta gerçek kullanıcı adı, gerçek doğum/period tarihi, gerçek health record, e-posta, purchase token veya kullanıcıyla ilişkilendirilebilir gerçek tarih kullanılmamalıdır. Görseller yalnızca sentetik örnek döngü ve sentetik günlük check-in verileriyle hazırlanmalıdır. Synthetic data ekranda küçük bir “örnek veri” ibaresiyle işaretlenebilir.

| # | Screen | Turkish headline | English headline | Subheadline | Show | Do not show |
|---:|---|---|---|---|---|---|
| 1 | Home / cycle overview | **Döngünün ritmini sakinlikle gör.** | **See your cycle rhythm calmly.** | Temel özet, mevcut döngü görünümü ve yaklaşan yaklaşık tarih. | Sentetik bir döngü özeti, Free tier görünümü, sade navigation. | Gerçek kullanıcı tarihi, kesinlik veya “guaranteed” prediction claim. |
| 2 | Calendar | **Kayıtların tek bakışta.** | **Your records at a glance.** | Günlük kayıt göstergeleri ve düzenlenebilir takvim. | Sentetik period record’lar, örnek takvim işaretleri, edit affordance. | Gerçek tarih, kullanıcıya ait not veya health detail. |
| 3 | Daily Check-In | **Bugün bedenini not et.** | **Check in with yourself.** | Flow, spotting, cramps, energy, mood, symptoms ve note alanları. | Tamamı sentetik örnek seçimler; ekranın Free erişilebilir olduğunu gösterecek bağlam. | Gerçek sağlık öyküsü, teşhis dili, ilaç veya tedavi önerisi. |
| 4 | Insights | **Veri var. Yargı yok.** | **Data, not judgment.** | Temel özet ve uygun olduğunda advanced insights paywall/gate. | Sentetik grafik ve “estimate/informational” disclaimer. | “100% accurate”, “predicts ovulation exactly”, medical-grade claim. |
| 5 | Privacy Center | **Verilerin üzerinde kontrol sende.** | **Your data, your control.** | Local-first records, export/import ve Clear All Data açıklaması. | Health records cihazda tasarımını anlatan gerçek UI; boş veya sentetik değerler. | “Never leaves your device” blanket claim, gerçek dosya adı, token. |
| 6 | Reminder settings | **Hatırlatmalarını kendin seç.** | **Choose your reminders.** | Local notification ve private notification text preference. | Genel/private bildirim örneği, işletim sistemi izni bağlamı. | Gerçek period tarihi veya hassas bildirim metni. |
| 7 | Luna Plus | **Daha sakin bir Luna.** | **A calmer Luna.** | Ad-free experience, advanced insights, monthly/yearly localized store price. | Product card ve gerçek mağazadan gelen fiyat placeholder/state; restore action. | Hardcoded price, fake countdown, deceptive discount, hidden close. |
| 8 | Theme example | **Işık nasıl olursa olsun, alanın senin.** | **Your space, in your light.** | Light/dark/system theme seçenekleri. | Aynı sentetik örneğin açık ve koyu tema görünümleri. | Gerçek kullanıcı verisi, sağlık sonucu veya platformda olmayan theme claim. |

## Composition notes

Her ekranın metin hiyerarşisi tek bir ana vaadi taşımalıdır. Sağlık ekranlarında reklam veya premium satın alma çağrısı, kullanıcıyı hassas bir kaydı tamamlamaktan alıkoyacak şekilde öne çıkarılmamalıdır. Luna Plus screenshot’ında aylık/yıllık seçeneklerin product detail ve localized price ile geldiği açıkça gösterilmeli; fiyat görsel üzerinde elle yazılmamalıdır.

## Final capture checklist

Screenshot capture öncesinde demo verisinin sentetik olduğu, gerçek kullanıcı hesabı bulunmadığı, e-posta ve satın alma token’ı görünmediği kontrol edilmelidir. Her platformun güncel cihaz boyutu, safe-area, status bar, dark/light ve store crop kuralları ilgili mağazanın submission ekranında tekrar doğrulanmalıdır.
