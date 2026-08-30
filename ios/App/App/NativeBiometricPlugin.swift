import Capacitor
import Foundation
import LocalAuthentication

@objc(NativeBiometricPlugin)
public final class NativeBiometricPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativeBiometricPlugin"
    public let jsName = "NativeBiometric"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "verifyIdentity", returnType: CAPPluginReturnPromise)
    ]

    @objc public func isAvailable(_ call: CAPPluginCall) {
        let context = LAContext()
        var error: NSError?
        let available = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
        call.resolve([
            "isAvailable": available,
            "status": available ? "available" : status(for: error)
        ])
    }

    @objc public func verifyIdentity(_ call: CAPPluginCall) {
        let context = LAContext()
        var availabilityError: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &availabilityError) else {
            call.reject("Biometric authentication is unavailable.", status(for: availabilityError))
            return
        }

        let reason = nonEmpty(call.getString("reason"), fallback: "Verilerini açmak için doğrula")
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
            DispatchQueue.main.async {
                if success {
                    call.resolve()
                    return
                }

                let code = self.errorCode(for: error as NSError?)
                if code == .userCancel || code == .appCancel || code == .systemCancel {
                    call.reject("Biometric authentication was cancelled.", "CANCELLED")
                } else {
                    call.reject("Biometric authentication failed.", "AUTHENTICATION_FAILED")
                }
            }
        }
    }

    private func status(for error: NSError?) -> String {
        switch errorCode(for: error) {
        case .biometryNotEnrolled:
            return "not-enrolled"
        case .biometryNotAvailable, .passcodeNotSet:
            return "unavailable"
        default:
            return "unavailable"
        }
    }

    private func errorCode(for error: NSError?) -> LAError.Code? {
        guard let error else { return nil }
        return LAError.Code(rawValue: error.code)
    }

    private func nonEmpty(_ value: String?, fallback: String) -> String {
        guard let value, !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return fallback
        }
        return value
    }
}
