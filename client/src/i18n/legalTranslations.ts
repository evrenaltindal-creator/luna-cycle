// TestFlight translation drafts, not jurisdiction-specific legal advice. Match termsSections order.
import { termsSections } from "@/features/legal/terms";
import type { Language } from "./language";

type Section = { title: string; paragraphs: string[] };
const localized: Record<Exclude<Language, "tr">, Section[]> = {
  en: [
    { title: "1. Acceptance and scope", paragraphs: [
      "Read and expressly accept these terms before using Luna Cycle. Downloading or installing the app alone does not count as in-app acceptance. If you decline, you cannot access the app's content.",
      "For versions obtained through the App Store, Apple's standard end-user license agreement also applies. These terms explain additional conditions for Luna Cycle's health-tracking features.",
    ] },
    { title: "2. Purpose of the app", paragraphs: [
      "Luna Cycle lets you track period start and end dates, daily observations, and approximate cycle information for personal use. Current features are free in the first release; there is no automatic paid membership or premium tier.",
    ] },
    { title: "3. Limits of medical use", paragraphs: [
      "The app is not a medical device or a diagnosis, treatment, or emergency service. Estimated period-start ranges are approximate and based only on the records you enter. Luna Cycle does not calculate ovulation timing or fertile or safe days. An unmarked calendar day does not mean there is no pregnancy risk.",
      "Do not use Luna Cycle for contraception, pregnancy prevention, or pregnancy planning. Do not rely on the app for medication, diagnosis, treatment, or emergency decisions. Consult a qualified healthcare professional about health concerns and local emergency services in an emergency.",
    ] },
    { title: "4. Records and device security", paragraphs: [
      "You are responsible for checking the dates and observations you enter. Missing or irregular records can affect estimates. Core health records are stored on your device in this release; protecting your device and operating-system account matters.",
      "You choose where to store an exported backup and whom to share it with. Luna Cycle cannot remotely delete a backup once it has left the app. No digital storage method can guarantee absolute security.",
    ] },
    { title: "5. Fees and ads", paragraphs: [
      "This release has no subscription, in-app purchase, or in-app advertising. If these are added later, the relevant disclosures and terms will be updated before use. Charges will not automatically begin after one year.",
    ] },
    { title: "6. Permitted use and rights", paragraphs: [
      "Do not use the app unlawfully, violate anyone's privacy, or undermine the service's security. The rights to the software, design, and brand remain with their respective owners; your right to use them is subject to the applicable license and law.",
    ] },
    { title: "7. Availability and responsibility", paragraphs: [
      "Some features may be interrupted by changes to devices, operating systems, or third-party services. To the extent allowed by applicable law, the app does not guarantee uninterrupted operation, medical accuracy, or a particular outcome.",
      "These terms do not remove non-waivable consumer or personal-data rights or responsibilities that cannot legally be excluded.",
    ] },
    { title: "8. Changes and contact", paragraphs: [
      "If the terms change materially, we will show the new version and ask for express acceptance before use. The accepted version and time are stored only on your device and are deleted when you clear the app's data.",
      "The legal provider's name, contact address, and country-specific provisions must be completed and reviewed by a legal professional before store release. This TestFlight text is not yet a final legal agreement.",
    ] },
  ],
  ru: [
    { title: "1. Принятие и область действия", paragraphs: [
      "Перед использованием Luna Cycle прочитайте и явно примите эти условия. Скачивание или установка приложения сами по себе не являются согласием в приложении. Если вы откажетесь, доступ к содержимому приложения будет закрыт.",
      "Для версий из App Store также действует стандартное лицензионное соглашение Apple с конечным пользователем. Эти условия дополнительно описывают функции отслеживания здоровья в Luna Cycle.",
    ] },
    { title: "2. Назначение приложения", paragraphs: [
      "Luna Cycle позволяет для личного пользования записывать даты начала и окончания менструации, ежедневные наблюдения и приблизительные сведения о цикле. В первом выпуске доступные функции бесплатны; автоматической платной подписки или премиум-уровня нет.",
    ] },
    { title: "3. Ограничения медицинского использования", paragraphs: [
      "Приложение не является медицинским устройством и не оказывает услуги диагностики, лечения или экстренной помощи. Примерные интервалы начала менструации основаны только на введённых вами записях. Luna Cycle не рассчитывает время овуляции, фертильные или «безопасные» дни. Отсутствие отметки в календаре не означает отсутствие риска беременности.",
      "Не используйте Luna Cycle для контрацепции, предотвращения или планирования беременности. Не полагайтесь на приложение при выборе лекарств, постановке диагноза, лечении или принятии экстренных решений. По вопросам здоровья обратитесь к квалифицированному специалисту, а в экстренной ситуации — в местную службу помощи.",
    ] },
    { title: "4. Записи и безопасность устройства", paragraphs: [
      "Проверяйте точность введённых дат и наблюдений. Пропущенные или нерегулярные записи могут влиять на прогнозы. В этом выпуске основные медицинские записи хранятся на вашем устройстве; важно защищать устройство и учётную запись операционной системы.",
      "Вы сами выбираете, где хранить экспортированную резервную копию и с кем ею делиться. Luna Cycle не может удалённо удалить копию после её вывода из приложения. Ни один способ цифрового хранения не гарантирует абсолютную безопасность.",
    ] },
    { title: "5. Плата и реклама", paragraphs: [
      "В этом выпуске нет подписки, покупок внутри приложения или рекламы. Если они появятся позже, соответствующие сведения и условия будут обновлены до начала их использования. Через год плата не начнёт взиматься автоматически.",
    ] },
    { title: "6. Допустимое использование и права", paragraphs: [
      "Не используйте приложение незаконно, не нарушайте чужую конфиденциальность и не подрывайте безопасность сервиса. Права на программное обеспечение, дизайн и бренд сохраняются за их правообладателями; ваше право использования ограничено применимой лицензией и законом.",
    ] },
    { title: "7. Доступность и ответственность", paragraphs: [
      "Некоторые функции могут работать с перебоями из-за изменений устройств, операционных систем или сторонних сервисов. В пределах, допускаемых применимым законом, приложение не гарантирует бесперебойную работу, медицинскую точность или определённый результат.",
      "Эти условия не отменяют права потребителей и права в отношении персональных данных, от которых нельзя отказаться по закону, а также ответственность, которую закон не позволяет исключить.",
    ] },
    { title: "8. Изменения и контакты", paragraphs: [
      "При существенном изменении условий мы покажем новую версию и попросим явно принять её до использования. Версия и время принятия хранятся только на вашем устройстве и удаляются при очистке данных приложения.",
      "Имя юридического поставщика, контактный адрес и положения для отдельных стран должны быть дополнены и проверены юристом до публикации в магазине. Этот текст для TestFlight ещё не является окончательным юридическим соглашением.",
    ] },
  ],
  de: [
    { title: "1. Annahme und Geltungsbereich", paragraphs: [
      "Lies diese Bedingungen und stimme ihnen ausdrücklich zu, bevor du Luna Cycle nutzt. Das Herunterladen oder Installieren allein gilt nicht als Zustimmung in der App. Wenn du ablehnst, kannst du die Inhalte der App nicht nutzen.",
      "Für Versionen aus dem App Store gilt außerdem Apples Standard-Endnutzer-Lizenzvertrag. Diese Bedingungen erläutern zusätzliche Regeln für die Gesundheits-Tracking-Funktionen von Luna Cycle.",
    ] },
    { title: "2. Zweck der App", paragraphs: [
      "Mit Luna Cycle kannst du Beginn und Ende deiner Periode, tägliche Beobachtungen und ungefähre Zyklusinformationen für dich persönlich festhalten. Die vorhandenen Funktionen sind in der ersten Version kostenlos; es gibt keine automatische kostenpflichtige Mitgliedschaft und keine Premium-Stufe.",
    ] },
    { title: "3. Grenzen der medizinischen Nutzung", paragraphs: [
      "Die App ist kein Medizinprodukt und bietet keine Diagnose, Behandlung oder Notfallhilfe. Geschätzte Zeiträume für den Periodenbeginn beruhen nur auf deinen eingegebenen Daten und sind ungenau. Luna Cycle berechnet weder den Eisprung noch fruchtbare oder „sichere“ Tage. Ein nicht markierter Kalendertag bedeutet nicht, dass kein Schwangerschaftsrisiko besteht.",
      "Nutze Luna Cycle nicht zur Verhütung oder Schwangerschaftsplanung. Verlasse dich bei Medikamenten, Diagnosen, Behandlungen oder Notfallentscheidungen nicht auf die App. Wende dich bei Gesundheitsfragen an medizinisches Fachpersonal und im Notfall an die örtlichen Notdienste.",
    ] },
    { title: "4. Einträge und Gerätesicherheit", paragraphs: [
      "Prüfe die Richtigkeit deiner eingegebenen Daten und Beobachtungen. Fehlende oder unregelmäßige Einträge können Schätzungen beeinflussen. Die grundlegenden Gesundheitsdaten werden in dieser Version auf deinem Gerät gespeichert; schütze dein Gerät und dein Betriebssystemkonto.",
      "Du entscheidest, wo eine exportierte Sicherung gespeichert und mit wem sie geteilt wird. Luna Cycle kann eine Sicherung außerhalb der App nicht aus der Ferne löschen. Keine digitale Speichermethode bietet absolute Sicherheit.",
    ] },
    { title: "5. Kosten und Werbung", paragraphs: [
      "Diese Version enthält keine Abonnements, In-App-Käufe oder In-App-Werbung. Falls solche Angebote später hinzukommen, werden die entsprechenden Informationen und Bedingungen vor ihrer Nutzung aktualisiert. Nach einem Jahr beginnt keine automatische Berechnung von Gebühren.",
    ] },
    { title: "6. Zulässige Nutzung und Rechte", paragraphs: [
      "Nutze die App nicht rechtswidrig, verletze nicht die Privatsphäre anderer und beeinträchtige nicht die Sicherheit des Dienstes. Die Rechte an Software, Design und Marke bleiben bei den jeweiligen Rechteinhabern; dein Nutzungsrecht richtet sich nach der anwendbaren Lizenz und dem Gesetz.",
    ] },
    { title: "7. Verfügbarkeit und Verantwortung", paragraphs: [
      "Änderungen an Geräten, Betriebssystemen oder Diensten Dritter können Funktionen unterbrechen. Soweit gesetzlich zulässig, garantiert die App weder einen unterbrechungsfreien Betrieb noch medizinische Genauigkeit oder ein bestimmtes Ergebnis.",
      "Diese Bedingungen schränken unabdingbare Verbraucher- und Datenschutzrechte oder gesetzlich nicht ausschließbare Haftung nicht ein.",
    ] },
    { title: "8. Änderungen und Kontakt", paragraphs: [
      "Bei wesentlichen Änderungen zeigen wir die neue Fassung vor der Nutzung an und bitten erneut um ausdrückliche Zustimmung. Fassung und Zeitpunkt der Zustimmung werden nur auf deinem Gerät gespeichert und beim Löschen der App-Daten entfernt.",
      "Der Name des rechtlichen Anbieters, die Kontaktadresse und länderspezifische Bestimmungen müssen vor der Veröffentlichung im Store ergänzt und juristisch geprüft werden. Dieser TestFlight-Text ist noch keine endgültige rechtliche Vereinbarung.",
    ] },
  ],
  es: [
    { title: "1. Aceptación y alcance", paragraphs: [
      "Lee y acepta expresamente estas condiciones antes de usar Luna Cycle. Descargar o instalar la aplicación no constituye por sí solo una aceptación dentro de ella. Si no las aceptas, no podrás acceder a su contenido.",
      "Para las versiones obtenidas en App Store también se aplica el contrato de licencia estándar para usuarios finales de Apple. Estas condiciones explican reglas adicionales para las funciones de seguimiento de salud de Luna Cycle.",
    ] },
    { title: "2. Finalidad de la aplicación", paragraphs: [
      "Luna Cycle permite registrar, para uso personal, el inicio y el fin de la menstruación, las observaciones diarias y datos aproximados del ciclo. Las funciones disponibles son gratuitas en la primera versión; no hay membresía de pago automática ni nivel prémium.",
    ] },
    { title: "3. Límites del uso médico", paragraphs: [
      "La aplicación no es un dispositivo médico ni ofrece diagnóstico, tratamiento o asistencia de emergencia. Los intervalos estimados de inicio de la menstruación son aproximados y se basan únicamente en los datos que introduces. Luna Cycle no calcula la fecha de ovulación ni identifica días fértiles o «seguros». Que un día no esté marcado en el calendario no significa que no exista riesgo de embarazo.",
      "No uses Luna Cycle como método anticonceptivo ni para evitar o planificar un embarazo. No te bases en la aplicación para decidir sobre medicamentos, diagnósticos, tratamientos o emergencias. Consulta a un profesional sanitario cualificado si tienes dudas de salud y acude a los servicios locales de emergencia cuando sea necesario.",
    ] },
    { title: "4. Registros y seguridad del dispositivo", paragraphs: [
      "Comprueba la exactitud de las fechas y observaciones que introduces. Los registros incompletos o irregulares pueden afectar a las estimaciones. En esta versión, los datos principales de salud se guardan en tu dispositivo; es importante protegerlo y proteger la cuenta de su sistema operativo.",
      "Tú eliges dónde guardar una copia de seguridad exportada y con quién compartirla. Luna Cycle no puede eliminarla a distancia una vez que sale de la aplicación. Ningún método de almacenamiento digital garantiza una seguridad absoluta.",
    ] },
    { title: "5. Costes y publicidad", paragraphs: [
      "Esta versión no incluye suscripciones, compras dentro de la aplicación ni publicidad en ella. Si se añaden más adelante, la información y las condiciones correspondientes se actualizarán antes de su uso. No se empezará a cobrar automáticamente después de un año.",
    ] },
    { title: "6. Uso permitido y derechos", paragraphs: [
      "No uses la aplicación de forma ilegal, no vulneres la privacidad de otras personas ni comprometas la seguridad del servicio. Los derechos sobre el software, el diseño y la marca pertenecen a sus titulares; tu derecho de uso está limitado por la licencia y la legislación aplicables.",
    ] },
    { title: "7. Disponibilidad y responsabilidad", paragraphs: [
      "Los cambios en los dispositivos, los sistemas operativos o los servicios de terceros pueden interrumpir algunas funciones. En la medida permitida por la ley aplicable, la aplicación no garantiza un funcionamiento ininterrumpido, precisión médica ni un resultado concreto.",
      "Estas condiciones no eliminan los derechos irrenunciables de los consumidores o relativos a los datos personales, ni las responsabilidades que la ley no permita excluir.",
    ] },
    { title: "8. Cambios y contacto", paragraphs: [
      "Si las condiciones cambian de forma importante, mostraremos la nueva versión y pediremos una aceptación expresa antes de usar la aplicación. La versión aceptada y la fecha se guardan solo en tu dispositivo y se eliminan al borrar los datos de la aplicación.",
      "El nombre del proveedor legal, la dirección de contacto y las disposiciones específicas de cada país deben completarse y ser revisados por un profesional del derecho antes de publicar en la tienda. Este texto para TestFlight aún no es un acuerdo legal definitivo.",
    ] },
  ],
};

const lookup = new Map<string, Partial<Record<Language, string>>>();
for (let index = 0; index < termsSections.length; index++) {
  const source = termsSections[index];
  for (const language of ["en", "ru", "de", "es"] as const) {
    const target = localized[language][index];
    if (!target || target.paragraphs.length !== source.paragraphs.length) throw new Error("Terms translation structure mismatch");
    lookup.set(source.title, { ...lookup.get(source.title), [language]: target.title });
    source.paragraphs.forEach((paragraph, paragraphIndex) =>
      lookup.set(paragraph, { ...lookup.get(paragraph), [language]: target.paragraphs[paragraphIndex] }));
  }
}

export function legalTranslation(source: string, language: Language): string | undefined {
  return lookup.get(source)?.[language];
}
