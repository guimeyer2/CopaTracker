import { Routes, Route } from "react-router-dom";
import { TopBar } from "./components/TopBar";
import { Calendar } from "./pages/Calendar";
import {
  MatchDetailPage,
  StatsPage,
  ProfilePage,
} from "./pages/Placeholder";

export default function App() {
  return (
    <div className="relative z-10 min-h-dvh">
      <TopBar />
      <main>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/match/:id" element={<MatchDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}
