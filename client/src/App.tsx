// Style: Sessiz Ay Takvimi — warm editorial wellness, sage ink, lemon accent, serif display + sans UI.
import Home from "./pages/Home";
import { MonetizationProvider } from "./features/monetization/MonetizationContext";

export default function App() {
  return <MonetizationProvider><Home /></MonetizationProvider>;
}
