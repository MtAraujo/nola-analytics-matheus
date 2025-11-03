import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import DashboardListPage from "./pages/DashboardListPage";
import SharedDashboardPage from "./pages/SharedDashboardPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🏠 Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Páginas principais */}
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/dashboards" element={<DashboardListPage />} />
        <Route path="/shares/:token" element={<SharedDashboardPage />} />

        {/* Rota coringa */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-gray-700">
              404 - Página não encontrada
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
