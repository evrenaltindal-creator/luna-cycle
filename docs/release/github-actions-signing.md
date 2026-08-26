# GitHub Actions iOS Signing ve TestFlight Secret Sözleşmesi

Bu belge Luna Cycle’ın yalnızca iOS signed archive, IPA ve TestFlight internal upload akışı için gerekli secret adlarını tanımlar. Gerçek değerler bu dosyaya, repository’ye veya commit geçmişine yazılmaz.

## Repository secrets

| Secret | Amaç | Nereden alınır | Beklenen format | Base64 gerekli mi? |
|---|---|---|---|---|
| `APPLE_TEAM_ID` | Apple Developer team identifier | Apple Developer Account → Membership details | 10 karakterlik takım ID’si | Hayır |
| `BUILD_CERTIFICATE_BASE64` | Private key içeren Apple Distribution certificate | macOS Keychain’den `.p12` export | Base64 encoded `.p12` | Evet |
| `P12_PASSWORD` | `.p12` export parolası | Certificate export sırasında belirlenir | Düz metin secret | Hayır |
| `BUILD_PROVISION_PROFILE_BASE64` | `com.lunacycle.tracker` için App Store distribution profile | Apple Developer → Profiles | Base64 encoded `.mobileprovision` | Evet |
| `KEYCHAIN_PASSWORD` | CI temporary keychain parolası | Kullanıcı tarafından güçlü ve benzersiz oluşturulur | Düz metin secret | Hayır |
| `APP_STORE_CONNECT_KEY_ID` | App Store Connect Team API Key ID | App Store Connect → Users and Access → Integrations → API | Key ID | Hayır |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect API issuer | Aynı API paneli | UUID | Hayır |
| `APP_STORE_CONNECT_API_KEY_P8` | App Store Connect API private key içeriği | `.p8` yalnızca oluşturulduğu anda indirilebilir | Ham PEM metni, `BEGIN PRIVATE KEY` ile | Hayır |
| `IOS_PROVISIONING_PROFILE_NAME` | Archive sırasında profile specifier | Decode edilen profile’ın `Name` alanı | Profile name | Hayır |

## Güvenlik kuralları

`BUILD_CERTIFICATE_BASE64`, `P12_PASSWORD`, `BUILD_PROVISION_PROFILE_BASE64`, `KEYCHAIN_PASSWORD` ve `APP_STORE_CONNECT_API_KEY_P8` yalnız GitHub repository secrets içinde tutulmalıdır. `.p12`, `.mobileprovision`, `.p8`, base64 çıktıları, parolalar ve provisioning profile içerikleri repository’ye commit edilmemelidir.

Provisioning profile wildcard olmamalı ve application identifier olarak kesinlikle `com.lunacycle.tracker` içermelidir. Android kimliği bu akışta değişmez: `com.lunacycle.app`.

Workflow, `upload_testflight=false` iken signing secret istemez. `upload_testflight=true` iken eksik secret’ları isimleriyle birlikte fail-fast olarak bildirir; secret değerlerini loglamaz. Temporary keychain, decoded certificate/profile ve API key dosyası job sonunda silinir.

## Local hazırlık örnekleri

Aşağıdaki komutlar yalnızca kullanıcı tarafından güvenilir yerel makinede çalıştırılmalıdır; çıktılar terminal geçmişine veya dosyaya kaydedilmemelidir.

```bash
base64 < distribution.p12 | tr -d '\n'
base64 < LunaCycle_AppStore.mobileprovision | tr -d '\n'
```

App Store Connect API key için `.p8` dosyasının içeriği secret değerine doğrudan, satır sonları korunarak yapıştırılmalıdır. API key dosyası ve signing dosyaları workflow dışında güvenli biçimde saklanmalıdır.

## Workflow tetikleme

İlk aşamada `upload_testflight=false` ile unsigned simulator validation çalıştırılır. Signing secrets tamamlandıktan sonra GitHub Actions → Luna Cycle iOS TestFlight → Run workflow ekranında `upload_testflight=true` seçilir. Bu seçenek yalnız archive/export ve TestFlight upload yolunu etkinleştirir; App Store review veya production release yapmaz.
