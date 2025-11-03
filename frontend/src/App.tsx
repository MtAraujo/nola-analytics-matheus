import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import DashboardListPage from "./pages/DashboardListPage";
import SharedDashboardPage from "./pages/SharedDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/dashboards" element={<DashboardListPage />} />
        <Route path="/shares/:token" element={<SharedDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
