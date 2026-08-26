// Style: Sessiz Ay Takvimi — the journal opens only after its local storage adapter is ready.
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeNativeStorage } from "./features/cycle/nativeStorage.adapter";
import { isNativePlatform } from "./platform/platform";

async function bootstrap() {
  if (isNativePlatform()) document.documentElement.classList.add("native-runtime");
  await initializeNativeStorage();
  createRoot(document.getElementById("root")!).render(<App />);
}

void bootstrap();
