package com.lunacycle.app;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

/**
 * Style: Sessiz Ay Takvimi — the native shell protects private health content
 * before the WebView becomes visible and exposes only explicit local bridges.
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );
        registerPlugin(NativeBiometricPlugin.class);
        registerPlugin(NativeBillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
