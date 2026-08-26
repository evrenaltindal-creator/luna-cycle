// Style: Sessiz Ay Takvimi — native shell keeps the quiet editorial Luna surface while bundling all web assets locally.
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lunacycle.app",
  appName: "Luna Cycle",
  webDir: "dist/public",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 350,
      launchAutoHide: true,
      backgroundColor: "#f5f1e8",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#f5f1e8",
      insetsHandling: "disable",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_luna",
      iconColor: "#52655a",
    },
  },
  android: {
    allowMixedContent: false,
    loggingBehavior: "none",
  },
  server: {
    cleartext: false,
  },
};

export default config;
