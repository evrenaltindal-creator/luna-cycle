import Capacitor

final class LunaBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(NativeBillingPlugin())
        bridge?.registerPluginInstance(NativeBiometricPlugin())
    }
}
