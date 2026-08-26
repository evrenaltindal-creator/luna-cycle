package com.lunacycle.app;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.concurrent.Executor;

/**
 * Style: Sessiz Ay Takvimi — biometric access is explicit, local, and never
 * exposes health data in errors or logs.
 */
@CapacitorPlugin(name = "NativeBiometric")
public class NativeBiometricPlugin extends Plugin {

    private static final int AUTHENTICATORS =
        BiometricManager.Authenticators.BIOMETRIC_STRONG |
        BiometricManager.Authenticators.DEVICE_CREDENTIAL;

    @PluginMethod
    public void isAvailable(PluginCall call) {
        BiometricManager manager = BiometricManager.from(getContext());
        int result = manager.canAuthenticate(AUTHENTICATORS);
        JSObject response = new JSObject();
        response.put("isAvailable", result == BiometricManager.BIOMETRIC_SUCCESS);
        response.put("status", statusFor(result));
        call.resolve(response);
    }

    @PluginMethod
    public void verifyIdentity(PluginCall call) {
        BiometricManager manager = BiometricManager.from(getContext());
        int availability = manager.canAuthenticate(AUTHENTICATORS);
        if (availability != BiometricManager.BIOMETRIC_SUCCESS) {
            call.reject("Biyometrik doğrulama kullanılamıyor.", statusFor(availability));
            return;
        }

        String reason = nonEmpty(call.getString("reason"), "Verilerini açmak için doğrula");
        String title = nonEmpty(call.getString("title"), "Luna Cycle");
        String subtitle = nonEmpty(call.getString("subtitle"), "Özel sağlık kayıtların");
        String description = nonEmpty(call.getString("description"), "Kayıtlarını görmek için doğrulama yap.");
        Executor executor = ContextCompat.getMainExecutor(getContext());
        BiometricPrompt.AuthenticationCallback callback = new BiometricPrompt.AuthenticationCallback() {
            @Override
            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                call.setKeepAlive(false);
                call.resolve();
            }

            @Override
            public void onAuthenticationFailed() {
                notifyListeners("authenticationFailed", new JSObject());
            }

            @Override
            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                call.setKeepAlive(false);
                if (isCancellation(errorCode)) {
                    call.reject("Biyometrik doğrulama iptal edildi.", "CANCELLED");
                } else {
                    call.reject("Biyometrik doğrulama başarısız.", "AUTHENTICATION_FAILED");
                }
            }
        };

        getActivity().runOnUiThread(() -> {
            try {
                BiometricPrompt prompt = new BiometricPrompt(getActivity(), executor, callback);
                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setSubtitle(subtitle)
                    .setDescription(description)
                    .setAllowedAuthenticators(AUTHENTICATORS)
                    .build();
                call.setKeepAlive(true);
                prompt.authenticate(promptInfo);
            } catch (RuntimeException exception) {
                call.setKeepAlive(false);
                call.reject("AUTHENTICATION_FAILED", "Biyometrik doğrulama başlatılamadı.");
            }
        });
    }

    private static String statusFor(int result) {
        switch (result) {
            case BiometricManager.BIOMETRIC_SUCCESS:
                return "available";
            case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                return "not-enrolled";
            default:
                return "unavailable";
        }
    }

    private static boolean isCancellation(int errorCode) {
        return errorCode == BiometricPrompt.ERROR_USER_CANCELED
            || errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON
            || errorCode == BiometricPrompt.ERROR_CANCELED;
    }

    private static String nonEmpty(String value, String fallback) {
        return value == null || value.trim().isEmpty() ? fallback : value;
    }
}
