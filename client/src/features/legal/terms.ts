export const TERMS_VERSION = "2026-09-28.1";

export type TermsAcceptance = { version: string; acceptedAt: string };

export function hasCurrentTermsAcceptance(value: unknown): value is TermsAcceptance {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<TermsAcceptance>;
  return record.version === TERMS_VERSION && typeof record.acceptedAt === "string" && !Number.isNaN(Date.parse(record.acceptedAt));
}

export function createTermsAcceptance(now = new Date()): TermsAcceptance {
  return { version: TERMS_VERSION, acceptedAt: now.toISOString() };
}

// This text is an in-app TestFlight draft, not a substitute for jurisdiction-specific legal review.
export const termsSections = [
  {
    title: "1. Kabul ve kapsam",
    paragraphs: ["Luna Cycle'ı kullanmadan önce bu koşulları okuyup açıkça kabul etmen gerekir. İndirme veya kurulum tek başına uygulama içindeki kabul yerine geçmez. Kabul etmezsen uygulamanın içeriğine erişemezsin.", "App Store üzerinden edinilen sürümlerde Apple'ın standart son kullanıcı lisans sözleşmesi de uygulanır. Bu metin, Luna Cycle'ın sağlık takibi özelliklerine ilişkin ek kullanım koşullarını açıklar."],
  },
  {
    title: "2. Uygulamanın amacı",
    paragraphs: ["Luna Cycle, adet başlangıç ve bitişlerini, günlük gözlemleri ve yaklaşık döngü bilgilerini kişisel takip amacıyla sunar. İlk sürümde mevcut özellikler ücretsizdir; otomatik ücretli üyelik veya premium katman yoktur."],
  },
  {
    title: "3. Tıbbi kullanım sınırı",
    paragraphs: ["Uygulama tıbbi cihaz, tanı, tedavi veya acil yardım hizmeti değildir. Adet ve yumurtlama zamanı aralıkları yalnızca girilen kayıtlardan türetilen yaklaşık tahminlerdir; gerçek yumurtlamayı, doğurgan veya güvenli günleri doğrulamaz.", "Gebelikten korunma veya gebelik planlama, ilaç kullanımı, tanı, tedavi ya da acil kararlar için yalnızca uygulamaya güvenme. Sağlık sorularında yetkin bir sağlık profesyoneline, acil durumlarda yerel acil yardım hizmetlerine başvur."],
  },
  {
    title: "4. Kayıtlar ve cihaz güvenliği",
    paragraphs: ["Girdiğin tarihlerin ve gözlemlerin doğruluğunu sen kontrol edersin. Eksik veya düzensiz kayıtlar tahminleri etkileyebilir. Temel sağlık kayıtları mevcut sürümde cihazında tutulur; cihazını ve işletim sistemi hesabını koruman önemlidir.", "İsteğinle dışa aktardığın yedek dosyasının nerede saklanacağını ve kiminle paylaşılacağını sen seçersin. Uygulama dışına çıkmış bir yedeği Luna Cycle uzaktan silemez. Hiçbir dijital saklama yöntemi mutlak güvenlik garantisi vermez."],
  },
  {
    title: "5. Ücret ve reklam",
    paragraphs: ["Bu sürümde abonelik, uygulama içi satın alma veya uygulama içi reklam bulunmaz. Gelecekte bunlar eklenirse ilgili açıklamalar ve koşullar kullanıma alınmadan önce güncellenir; bir yıl sonra kendiliğinden ücretlendirme başlamaz."],
  },
  {
    title: "6. İzin verilen kullanım ve haklar",
    paragraphs: ["Uygulamayı hukuka aykırı biçimde, başkalarının gizliliğini ihlal etmek veya hizmetin güvenliğini bozmak için kullanamazsın. Yazılımın, tasarımın ve markanın hakları ilgili hak sahiplerinde kalır; kullanım hakkın, uygulanabilir lisans ve hukukla sınırlıdır."],
  },
  {
    title: "7. Kullanılabilirlik ve sorumluluk",
    paragraphs: ["Cihaz, işletim sistemi veya üçüncü taraf hizmetlerdeki değişiklikler nedeniyle bazı özellikler kesintiye uğrayabilir. Uygulanabilir hukukun izin verdiği ölçüde uygulama kesintisiz çalışma, tıbbi doğruluk veya belirli bir sonuca ulaşma garantisi vermez.", "Bu koşullar, kanunen kaldırılamayan tüketici ve kişisel veri haklarını veya kanunen hariç tutulamayacak sorumlulukları ortadan kaldırmaz."],
  },
  {
    title: "8. Değişiklikler ve iletişim",
    paragraphs: ["Koşullarda önemli bir değişiklik yapılırsa yeni sürümü kullanım öncesinde yeniden göstereceğiz ve açık kabul isteyeceğiz. Kabul kaydının sürümü ve zamanı yalnızca cihazında saklanır; uygulama verilerini temizlediğinde bu kayıt da silinir.", "Yasal sağlayıcı adı, iletişim adresi ve ülkeye özgü hükümler mağaza yayını öncesinde tamamlanıp hukuk uzmanına inceletilmelidir. Bu TestFlight metni henüz nihai hukuki sözleşme değildir."],
  },
] as const;
