import { Routes, Route } from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TankPage from "./pages/TankPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import CreateTank from "./pages/CreateTank";
import FindTank from "./pages/FindTanks";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>

      <Navbar />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
            ========================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* =========================
            PROTECTED ROUTES
            ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/tanks/:tankId" element={<TankPage />} />

          <Route path="/tanks/create" element={<CreateTank />} />
          
          <Route path="/tanks/find" element={<FindTank />} />

        </Route>


        {/* =========================
            404
            ========================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </AuthProvider>
  );
}

export default App;